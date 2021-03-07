package com.highradius.daoImpl;

import java.io.IOException;
import java.sql.Array;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.highradius.pojo;
import com.highradius.dao.GridDaoInterface;

public class GridLoadDao implements GridDaoInterface {
	
	public Connection dbCon = null;
	protected Statement getConnection() throws ClassNotFoundException {
		String url="jdbc:mysql://localhost:3306/sakila";
		String user = "root";
		String pass = "root";
		Statement stmt = null;
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			dbCon = DriverManager.getConnection(url,user,pass);
			System.out.println("SQL DataBase Connected...");  
			stmt = dbCon.createStatement (ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
		}
		catch(Exception e) {
			System.out.println("SQL DataBase Not Connected -- " + e);
			e.printStackTrace();
		}
		return stmt;
	}
	
	protected void closeConnection(ResultSet rs, ResultSet countRs) {
		try {
			dbCon.close();
		} 
		catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			if(rs != null)
				rs.close();
			if(countRs != null)
				countRs.close();
		} 
		catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	protected HashMap<String, Object> writeToJSON(ResultSet rs, long totalCount) throws IOException, SQLException {
		List<pojo> dataList = new ArrayList<>();
		pojo iData = new pojo();
		HashMap<String, Object> dataMap = new HashMap<String, Object>();
		
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
		
		dataMap.put("data", dataList);
		dataMap.put("total", totalCount);
		System.out.println(totalCount+" Rows uploaded");
		return dataMap;
	}
	
	public HashMap<String, Object> fetchGridData(int start, int limit) {
        ResultSet rs = null, countRs = null;
        long totalCount = 0;
        
		HashMap<String, Object> movieData = new HashMap<String, Object>();
		String query = "SELECT film.film_id, `title`, `description`, `release_year`, `length`, `rating`, `imdb_rating`, `director`, language.name AS `language`, `country`, category.name AS film_category, `special_features` "
				+ "FROM film INNER JOIN `language` ON film.language_id = language.language_id "
				+ "INNER JOIN `country` ON film.country_id = country.country_id "
				+ "INNER JOIN `film_category` ON film.film_id = film_category.film_id "
				+ "INNER JOIN `category` ON film_category.category_id = category.category_id "
				+ "WHERE `is_deleted` = 0 ";
		String countQuery = "SELECT COUNT(*) AS totalcount FROM film WHERE `is_deleted` = 0";
		System.out.println("Grid Loading..");
		
		try {
			Statement stmt = getConnection();
			query += "LIMIT " + start + ", " + limit;
			System.out.println("query="+query);
			countRs = stmt.executeQuery(countQuery);
			while(countRs.next())
				totalCount = countRs.getInt("totalcount");
			
			rs = stmt.executeQuery(query);
			movieData = writeToJSON(rs, totalCount);
			return movieData;
		}
		
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			closeConnection(rs, countRs);
		}
		return movieData;
	}
	
	public HashMap<String, Object> fetchLangData() {
		ResultSet rs = null;
//        long totalCount = 0;
        
		HashMap<String, Object> langData = new HashMap<String, Object>();
		List<pojo> dataList = new ArrayList<>();
		pojo iData = new pojo();
		String query = "SELECT `language_id`, `name` FROM `language`;";
//		String countQuery = "SELECT COUNT(*) AS total_count FROM `language`";
		
		try {
			Statement stmt = getConnection();
			System.out.println("Langugage Loading..");
			
		    rs = stmt.executeQuery(query);
		    while(rs.next()) {
		    	iData.setLanguage_id(rs.getInt("language_id"));
		        iData.setName(rs.getString("name"));
	            dataList.add(iData);
	            iData = new pojo();
		    }
		    langData.put("data", dataList);
			
			return langData;
		}
		
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			closeConnection(rs, null);
		}
		return langData;
	}
	
	public HashMap<String, Object> fetchRatingData() {
		ResultSet rs2 = null;
//        long totalCount = 0;
        
		HashMap<String, Object> ratingData = new HashMap<String, Object>();
		List<pojo> dataList = new ArrayList<>();
		pojo iData = new pojo();
		String query = "SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING(COLUMN_TYPE, 7, LENGTH(COLUMN_TYPE) - 8), \"','\", 1 + units.i) , \"','\", -1) AS `rating` "
				+ "FROM INFORMATION_SCHEMA.COLUMNS "
				+ "CROSS JOIN (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) units "
				+ "WHERE TABLE_NAME = 'film' "
				+ "AND COLUMN_NAME = 'rating'";
		
		try {
			Statement stmt = getConnection();
			System.out.println("Ratings Loading..");
		    
		    rs2 = stmt.executeQuery(query);
		    while(rs2.next()) {
		        iData.setRating(rs2.getString("rating"));
	            dataList.add(iData);
	            iData = new pojo();
		    }
		    ratingData.put("data", dataList);
			
			return ratingData;
		}
		
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			closeConnection(rs2, null);
		}
		return ratingData;
	}
	
	public HashMap<String, Object> fetchFeaturesData() {
		ResultSet rs1 = null;
        long totalCount = 0;
        
		HashMap<String, Object> featuresData = new HashMap<String, Object>();
		List<pojo> dataList = new ArrayList<>();
		pojo iData = new pojo();
		String query = "SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING(COLUMN_TYPE, 7, LENGTH(COLUMN_TYPE) - 8), \"','\", 1 + units.i) , \"','\", -1) AS `features` "
				+ "FROM INFORMATION_SCHEMA.COLUMNS "
				+ "CROSS JOIN (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) units "
				+ "WHERE TABLE_NAME = 'film' "
				+ "AND COLUMN_NAME = 'special_features'";
		
		try {
			Statement stmt = getConnection();
			System.out.println("Features Loading..");

		    rs1 = stmt.executeQuery(query);
		    while(rs1.next()) {
		        iData.setSpecial_features(rs1.getString("features"));
	            dataList.add(iData);
	            iData = new pojo();
		    }
		    
		    featuresData.put("data", dataList);
			System.out.println(totalCount+" Rows uploaded");
			System.out.println("Data Map = " + featuresData);
			return featuresData;
		}
		
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			closeConnection(rs1, null);
		}
		return featuresData;
	}
	
	public HashMap<String, Object> fetchSearchData(String title, String year, String director, String language, int start, int limit) {
		HashMap<String, Object> movieData = new HashMap<String, Object>();
		GridLoadDao glDao = new GridLoadDao();
		
		ResultSet rs = null, countRs = null;
		long totalCount = 0;
		String query = "SELECT film.film_id, `title`, `description`, `release_year`, `length`, `rating`, `imdb_rating`, `director`, language.name AS `language`, language.language_id, `country`, category.name AS film_category, `special_features` "
				+ "FROM film INNER JOIN `language` ON film.language_id = language.language_id "
				+ "INNER JOIN `country` ON film.country_id = country.country_id "
				+ "INNER JOIN `film_category` ON film.film_id = film_category.film_id "
				+ "INNER JOIN `category` ON film_category.category_id = category.category_id "
				+ "WHERE `is_deleted` = 0 ";
		
		if(title != null && !title.contentEquals(""))
	    	query += "AND `title` LIKE '[title]%' ".replace("[title]", title);
	    if(year != null && !year.contentEquals(""))
	    	query += "AND `release_year` LIKE '[year]%' ".replace("[year]", year);
	    if(director != null && !director.contentEquals(""))
	    	query += "AND `director` LIKE '[director]%' ".replace("[director]", director);
	    if(language != null && !language.contentEquals(""))
//	    	if(language.replaceAll("[a-zA-Z]+", "").contentEquals(""))
	    		query += "AND language.name = '[language]' ".replace("[language]", language);
//	    	else if(language.replaceAll("[0-9]+", "").contentEquals(""))
//	    		query += "AND language.language_id = '" + language + "' ";
	    query += "LIMIT " + start + ", " + limit;
	    
	    try {
			Statement stmt = glDao.getConnection();
			System.out.println("Grid Searching..");
			System.out.println("query="+query);
			countRs = stmt.executeQuery(query);
		    countRs.last();
		    totalCount = countRs.getRow();
		    
			rs = stmt.executeQuery(query);
			movieData = glDao.writeToJSON(rs, totalCount);
			return movieData;
		}
		
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			glDao.closeConnection(rs, countRs);
		}
		return movieData;
	}
	
}
