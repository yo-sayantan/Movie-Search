package com.highradius.daoImpl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DeleteRecordsDao {
	
	private String success;
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
