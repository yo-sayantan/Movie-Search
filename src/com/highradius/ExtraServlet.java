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

@WebServlet("/loadgrid")
public class ExtraServlet extends HttpServlet {

	private static final long serialVersionUID = 5010310016245271016L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Connection dbCon = null;
        ResultSet rs = null, countRs = null;
        PrintWriter out = response.getWriter();
         
	    String url="jdbc:mysql://localhost:3306/sakila";
		String user = "root";
		String pass = "root";
		String value = request.getParameter("query");
		int totalCount = 0;
		String query = "", countQuery = "", json_str = "", json_str1 = "";
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			dbCon = DriverManager.getConnection(url,user,pass);
			Statement stmt = dbCon.createStatement (ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			
			if(value != null) {
				System.out.println("Executing Query = " + value);
				switch(value) {
				case "LoadLang":
					query = "SELECT `name` FROM `language`;";
					System.out.println("query="+query);
					
					countQuery = "SELECT COUNT(*) AS total_count FROM `language`";
				    countRs = stmt.executeQuery(countQuery);
				    while(countRs.next())
						totalCount = countRs.getInt("total_count");
				    countRs.close();
				    
				    rs = stmt.executeQuery(query);
					json_str = writeToJSON(rs, totalCount);
					out.print(json_str);
				    
					break;
				
				case "LoadRating":
					query = "SELECT DISTINCT `rating` FROM `film`;";
					System.out.println("query="+query);
					
					countQuery = "SELECT COUNT(DISTINCT `rating`) AS `total_count` FROM film;";
					countRs = stmt.executeQuery(countQuery);
				    while(countRs.next())
						totalCount = countRs.getInt("total_count");
				    countRs.close();
					
					rs = stmt.executeQuery(query);
					json_str = writeToJSON(rs, countRs.getInt("totalCount"));
					System.out.println(json_str);
					out.print(json_str);
				    
					break;
				default:
					query = "SELECT `name` FROM `language`;";
					System.out.println("query="+query);
					
					countQuery = "SELECT COUNT(*) AS total_count FROM `language`";
				    countRs = stmt.executeQuery(countQuery);
				    while(countRs.next())
						totalCount = countRs.getInt("total_count");
				    countRs.close();
				    
				    rs = stmt.executeQuery(query);
					json_str = writeToJSON(rs, totalCount);
					out.print(json_str);
				}
			}
					
			else {
				query = "SELECT `name` FROM `language`;";
				
				countQuery = "SELECT COUNT(*) AS total_count FROM `language`";
			    countRs = stmt.executeQuery(countQuery);
			    while(countRs.next())
					totalCount = countRs.getInt("total_count");
			    countRs.close();
			    
			    rs = stmt.executeQuery(query);
				json_str = writeToJSON(rs, totalCount);
				out.print(json_str);
			}
			
			if (dbCon != null)              
                System.out.println("SQL DataBase Connected");             
            else {            
                System.out.println("Not Connected");
                return;
            }
			System.out.println("Executing Query...");
			
			
		}
		catch (ClassNotFoundException cnfe) {
			System.out.println("Class not found or Driver Error");
		}
		catch (SQLException sqle) {
			System.out.println("Database Connection error or SQL Query error");
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
	
	private static String writeToJSON(ResultSet rs, int totalCount) throws IOException, SQLException {
		List<pojo> dataList = new ArrayList<>();
		pojo iData = new pojo();
		JSONObject jsonObj = new JSONObject();
		Gson gson = new Gson();
		GsonBuilder builder = new GsonBuilder(); 
		while(rs.next()) {
			try { 
//	            iData.setLanguage_id(rs.getInt("language_id"));
	            iData.setName(rs.getString("name"));
//	            iData.setCategory_id(rs.getString("category_id"));
	            
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
		
		jsonObj.put("data", dataList);
		jsonObj.put("total", totalCount);
		
		builder.setPrettyPrinting();
		gson = builder.create();
		String json_str = gson.toJson(jsonObj);
		return json_str;
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
}
