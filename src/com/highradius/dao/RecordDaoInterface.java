package com.highradius.dao;

public interface RecordDaoInterface {
	
	public String editRecord(String film_id, String title, String year, String director, String language,
			String description, String special_features, double imdb_rating, int length, String rating); 
	
	public String addRecord(String title, String year, String director, String language, String description,
			String special_features, double imdb_rating, int length, String rating);
	
	public String deleteGridData(String film_ids);
	
}
