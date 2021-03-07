package com.highradius.daoImpl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;

import com.highradius.dao.GridDaoInterface;

public class SearchGridDao {
	
	public HashMap<String, Object> fetchSearchData(String title, String year, String director, String language, int start, int limit) {
		HashMap<String, Object> movieData = new HashMap<String, Object>();
		GridLoadDao glDao = new GridLoadDao();
		
		ResultSet rs = null, countRs = null;
		long totalCount = 0;
		String query = "SELECT film.film_id, `title`, `description`, `release_year`, `length`, `rating`, `imdb_rating`, `director`, language.name AS `language`, `country`, category.name AS film_category, `special_features` "
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
	    	query += "AND language.name LIKE '[language]%' ".replace("[language]", language);
	    query += "LIMIT " + start + ", " + limit;
	    
	    try {
			Statement stmt = glDao.getConnection();
			System.out.println("Grid Searching..");
			
			countRs = stmt.executeQuery(query);
		    countRs.last();
		    totalCount = countRs.getRow();
		    System.out.println("totalCount="+totalCount);
		    
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
