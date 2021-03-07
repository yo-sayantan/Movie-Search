package com.highradius.daoImpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

import com.highradius.dao.RecordDaoInterface;

public class AddEditRecordDao implements RecordDaoInterface {
	
	private String success;
	public Connection dbCon = null;
	public String editRecord(String film_id, String title, String year, String director, String language,
			String description, String special_features, double imdb_rating, int length, String rating) {
		GridLoadDao glDao = new GridLoadDao();

		String query = "UPDATE film SET `title` = ?, `description` = ?, `release_year` = ?, `length` = ?, `rating` = ?, "
				+ "`language_id` = (SELECT `language_id` FROM `language` WHERE `name` = ?), "
				+ "`special_features` = (?), `director` = ?, `imdb_rating` = ? "
				+ "WHERE film_id = ? "
				+ "AND `is_deleted` = 0;";
		System.out.println("query="+query+"--"+film_id);
		
		try {
			Statement stmt = glDao.getConnection();
			PreparedStatement pstmt = glDao.dbCon.prepareStatement(query);
			pstmt.setString(1, title);
			pstmt.setString(2, description);
			pstmt.setString(3, year);
			pstmt.setInt(4, length);
			pstmt.setString(5, rating);
			pstmt.setString(6, language);
			pstmt.setString(7, special_features);
			pstmt.setString(8, director);
			pstmt.setDouble(9, imdb_rating);
			pstmt.setString(10, film_id);
			
			pstmt.executeUpdate();
			success = "success";
		} 
		catch (SQLException e) {
			e.printStackTrace();
			success = "failure";
		} 
		catch (ClassNotFoundException e) {
			e.printStackTrace();
			success = "failure";
		}
		
		return success;
	}
	
	public String addRecord(String title, String year, String director, String language, String description,
			String special_features, double imdb_rating, int length, String rating) {
		GridLoadDao glDao = new GridLoadDao();

		String query = "INSERT  INTO `film`(`film_id`,`title`,`description`,`release_year`,`language_id`,`original_language_id`,`rental_duration`,`rental_rate`,`length`,`replacement_cost`,`rating`,`special_features`,`last_update`,`director`,`imdb_rating`,`is_deleted`,`country_id`) VALUES "
				+ "(NULL, ?, ?, ?, (SELECT `language_id` FROM `language` WHERE `name` = ?), NULL, (SELECT FLOOR(RAND()*7)+1), (SELECT ROUND(RAND()*10,3)), ?, (SELECT ROUND(RAND()*50,2)), ?, (?), NOW(), ?, ?, 0, (SELECT FLOOR(RAND()*109)+1))";
//		special_features = special_features.replace(",", "\',\'");
//		query = query.replace("{(?)}", "(\'"+special_features+"\')");
		System.out.println(query);
		
		String categoryQuery = "INSERT INTO `film_category`(`film_id`,`category_id`,`last_update`) VALUES "
				+ "((SELECT `film_id` FROM `film` WHERE `title` LIKE '{?}%' ORDER BY 1 DESC LIMIT 1), "
				+ "(SELECT FLOOR(RAND()*16)+1), NOW())";
		
		try {
			Statement stmt = glDao.getConnection();
			PreparedStatement pstmt = glDao.dbCon.prepareStatement(query);
			pstmt.setString(1, title);
			pstmt.setString(2, description);
			pstmt.setString(3, year);
			pstmt.setString(4, language);
			pstmt.setInt(5, length);
			pstmt.setString(6, rating);
			pstmt.setString(7, special_features);
			pstmt.setString(8, director);
			pstmt.setDouble(9, imdb_rating);
			pstmt.executeUpdate();
			
			categoryQuery = categoryQuery.replace("{?}", title);
			stmt.executeUpdate(categoryQuery);
			success = "success";
		} 
		catch (SQLException e) {
			e.printStackTrace();
			success = "failure";
		} 
		catch (ClassNotFoundException e) {
			e.printStackTrace();
			success = "failure";
		}
		
		return success;
	}
	
	public String deleteGridData(String film_ids) {
		GridLoadDao glDao = new GridLoadDao();
		String query = "UPDATE film SET `is_deleted` = 1 WHERE `film_id` IN (?);";
		query = query.replace("?", film_ids);	
		
		try {
			Statement stmt = glDao.getConnection();
			stmt.executeUpdate(query);
			System.out.println(film_ids.split(",").length + " Record Deleted -- ID = " + film_ids);
			success = "success";
		} 
		catch (SQLException e) {
			e.printStackTrace();
			success = "failure";
		} 
		catch (ClassNotFoundException e) {
			e.printStackTrace();
			success = "failure";
		}
		
		return success;
	}
}
