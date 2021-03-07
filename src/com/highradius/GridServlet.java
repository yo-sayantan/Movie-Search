package com.highradius;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.google.gson.*;

@WebServlet("/showgrid")
public class GridServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Connection dbCon = null;
        ResultSet rs = null, countRs = null;
        PrintWriter out = response.getWriter();
        int totalCount = 0;
        
	    String url="jdbc:mysql://localhost:3306/sakila";
		String user = "root";
		String pass = "root";
		String value = request.getParameter("query");
		String start = request.getParameter("start");
		String limit = request.getParameter("limit");
		
		String json_str = null;
		String query = "SELECT DISTINCT film.film_id, `title`, `description`, `release_year`, `length`, `rating`, `imdb_rating`, `director`, language.name AS `language`, `country`, category.name AS film_category, `special_features` "
				+ "FROM film INNER JOIN `language` ON film.language_id = language.language_id "
				+ "INNER JOIN `country` ON film.country_id = country.country_id "
				+ "INNER JOIN `film_category` ON film.film_id = film_category.film_id "
				+ "INNER JOIN `category` ON film_category.category_id = category.category_id "
				+ "WHERE `is_deleted` = 0 ";
		String countQuery = "SELECT COUNT(*) AS totalcount FROM film WHERE `is_deleted` = 0";
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			dbCon = DriverManager.getConnection(url,user,pass);
			
			if (dbCon != null)              
                System.out.println("\nSQL DataBase Connected");             
            else {            
                System.out.println("Not Connected");
                return;
            }
			
			Statement stmt = dbCon.createStatement (ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			
			if(value != null && !value.contains("Load")) {
				System.out.println("Executing Query = " + value);
				switch(value) {
				case "Search": 
					query = searchGrid(query, request);					
					countRs = stmt.executeQuery(query);
				    countRs.last();
				    totalCount = countRs.getRow();
				    System.out.println("totalCount="+totalCount);
				    countRs.close();
				    
				    rs = stmt.executeQuery(query);
					json_str = writeToJSON(rs, totalCount);
					out.print(json_str);
					
					break;
					
				case "Edit": 
					editGrid(dbCon, request);
				    break;
					
				case "Delete": 
					query = deleteRecords(dbCon, request);
					stmt.executeUpdate(query);
					break;
					
				case "Add": 
					String movieName = request.getParameter("title");
					addToGrid(dbCon, request);
					String categoryQuery = "INSERT INTO `film_category`(`film_id`,`category_id`,`last_update`) VALUES "
							+ "((SELECT `film_id` FROM `film` WHERE `title` LIKE '{?}%' ORDER BY 1 DESC LIMIT 1), "
							+ "(SELECT FLOOR(RAND()*16)+1), NOW())";
					
					categoryQuery = categoryQuery.replace("{?}", movieName);
					stmt.executeUpdate(categoryQuery);
					
					break;
				}
			}
			
			else  {
				System.out.println("Executing Query = Grid Load");
				query += "LIMIT " + start + ", " + limit;
				
				countRs = stmt.executeQuery(countQuery);
				while(countRs.next())
					totalCount = countRs.getInt("totalcount");
				rs = stmt.executeQuery(query);
				json_str = writeToJSON(rs, totalCount);
				out.print(json_str);
			}
		}
		catch (ClassNotFoundException cnfe) {
			System.out.println("Class not found or Driver Error");
		}
		catch (SQLException sqle) {
			sqle.printStackTrace();
		}
		finally {
			try {
				if(dbCon != null)
					dbCon.close();
			}
			catch(Exception e) {
				System.out.println("Could not close DataBase Connection");
			}
			try {
				if(rs != null)
					rs.close();
			}
			catch(Exception e) {
				System.out.println("Could not close ResultSet");
			}
			try {
				if(out != null)
					out.flush();
			}
			catch(Exception e) {
				System.out.println("Could not close Print Writer");
			}
		}
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	private static String writeToJSON(ResultSet rs, int totalCount) throws IOException, SQLException {
		List<pojo> dataList = new ArrayList<>();
		pojo iData = new pojo();
		JSONObject jsonObj = new JSONObject();
		
		Gson gson = new Gson();
		GsonBuilder builder = new GsonBuilder(); 
		while(rs.next()) {
			try { 
	            iData.setFilm_id(rs.getInt("film_id"));
	            iData.setTitle(rs.getString("title"));
	            iData.setDescription(rs.getString("description"));
	            iData.setRelease_year(rs.getInt("release_year"));
	            iData.setLength(rs.getInt("length"));
	            iData.setRating(rs.getString("rating"));
	            iData.setImdb_rating(rs.getFloat("imdb_rating"));
	            iData.setDirector(rs.getString("director"));
	            iData.setLanguage(rs.getString("language"));
	            iData.setCountry(rs.getString("country"));
	            iData.setFilm_category(rs.getString("film_category"));
	            iData.setSpecial_features(rs.getString("special_features"));
	            
	            dataList.add(iData);
	            iData = new pojo();
	        } 
	        catch (NumberFormatException nfe) {
	        	System.out.println("Number Format Exception");
	        	continue;
	        }
	        catch (ArrayIndexOutOfBoundsException aeobe) {
	        	System.out.println("Array Index Out Of Bounds Exception");
	        }  
		}
		
//	    json_str = json_str.replace("[", "{\n\"total\":" + count +",\n \"data:\" [");
		jsonObj.put("data", dataList);
		jsonObj.put("total", totalCount);
		
		builder.setPrettyPrinting();
		gson = builder.create();
		String json_str = gson.toJson(jsonObj);
		System.out.println(totalCount+" Rows uploaded");
	    
		return json_str;
	}
	
	private String searchGrid(String query, HttpServletRequest request) {
		String movieName = request.getParameter("title");
		String year = request.getParameter("year");
		String director = request.getParameter("director");
		String language = request.getParameter("language");
		String start = request.getParameter("start");
		String limit = request.getParameter("limit");
		
		if(movieName != null && !movieName.contentEquals(""))
	    	query += "AND `title` LIKE '[title]%' ".replace("[title]", movieName);
	    if(year != null && !year.contentEquals(""))
	    	query += "AND `release_year` LIKE '[year]%' ".replace("[year]", year);
	    if(director != null && !director.contentEquals(""))
	    	query += "AND `director` LIKE '[director]%' ".replace("[director]", director);
	    if(language != null && !language.contentEquals(""))
	    	query += "AND language.name LIKE '[language]%' ".replace("[language]", language);
	    query += "LIMIT " + start + ", " + limit;
	    System.out.println("query="+ query);
		return query;
	}
	
	private void addToGrid(Connection dbCon, HttpServletRequest request) throws SQLException {
		String movieName = request.getParameter("title");
		String year = request.getParameter("year");
		String director = request.getParameter("director");
		String language = request.getParameter("language");
//		String type = request.getParameter("type");
		double imdbRating = Double.parseDouble(request.getParameter("imdb_rating"));
		String features = request.getParameter("special_features");
		String description = request.getParameter("description");
		String rating = request.getParameter("rating");
		int length = Integer.parseInt(request.getParameter("length"));
		
		String query = "INSERT  INTO `film`(`film_id`,`title`,`description`,`release_year`,`language_id`,`original_language_id`,`rental_duration`,`rental_rate`,`length`,`replacement_cost`,`rating`,`special_features`,`last_update`,`director`,`imdb_rating`,`is_deleted`,`country_id`) VALUES "
				+ "(NULL, ?, ?, ?, (SELECT `language_id` FROM `language` WHERE `name` = ?), NULL, (SELECT FLOOR(RAND()*7)+1), (SELECT ROUND(RAND()*10,3)), ?, (SELECT ROUND(RAND()*50,2)), ?, ?, NOW(), ?, ?, 0, (SELECT FLOOR(RAND()*109)+1))";
		
		PreparedStatement pstmt = dbCon.prepareStatement(query);
		pstmt.setString(1, movieName);
		pstmt.setString(2, description);
		pstmt.setString(3, year);
		pstmt.setString(4, language);
		pstmt.setInt(5, length);
		pstmt.setString(6, rating);
		pstmt.setString(7, features);
		pstmt.setString(8, director);
		pstmt.setDouble(9, imdbRating);
		
		pstmt.executeUpdate();
	}
	
	private void editGrid(Connection dbCon, HttpServletRequest request) throws SQLException {
		String movieName = request.getParameter("title");
		String year = request.getParameter("year");
		String director = request.getParameter("director");
		String language = request.getParameter("language");
	    String features = request.getParameter("special_features");
	    String description = request.getParameter("description");
	    double imdbRating = Double.parseDouble(request.getParameter("imdb_rating"));
	    String rating = request.getParameter("rating");
	    int id = Integer.parseInt(request.getParameter("film_id"));
	    int length = Integer.parseInt(request.getParameter("length"));
	    
		String query = "UPDATE film SET `title` = ?, `description` = ?, `release_year` = ?, `special_features` = ?, `director` = ?, `imdb_rating` = ?, `rating` = ?, `length` = ? "
				+ "WHERE film_id = ? "
				+ "AND `is_deleted` = 0;";
		
		PreparedStatement pstmt = dbCon.prepareStatement(query);
		pstmt.setString(1, movieName);
		pstmt.setString(2, description);
		pstmt.setString(3, year);
		pstmt.setString(4, features);
		pstmt.setString(5, director);
		pstmt.setDouble(6, imdbRating);
		pstmt.setString(7, rating);
		pstmt.setDouble(8, length);
		pstmt.setInt(9, id);
		
		pstmt.executeUpdate();
		
		if(language != null) {
			query = "UPDATE film SET `language_id` = "
					+ "(SELECT `language_id` FROM `language` WHERE `name` = ?) "
					+ "WHERE film_id = ?;";
			
			pstmt = dbCon.prepareStatement(query);
			pstmt.setString(1, language);
			pstmt.setInt(2, id);
			pstmt.executeUpdate();
		}
	}
	
	private String deleteRecords(Connection dbCon, HttpServletRequest request) {
		String ids = request.getParameter("id");
		String query = "UPDATE film SET `is_deleted` = 1 WHERE `film_id` IN (?);";
		query = query.replace("?", ids);
		
		return query;
	}
	
}
