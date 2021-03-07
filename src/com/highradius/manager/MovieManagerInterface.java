package com.highradius.manager;

import java.util.HashMap;

public interface MovieManagerInterface {
	
	public HashMap<String, Object> fetchGridData(int start, int limit);
	
	public HashMap<String, Object> fetchLangData();
	
	public HashMap<String, Object> fetchRatingData();
	
	public HashMap<String, Object> fetchFeaturesData();
	
	public HashMap<String, Object> fetchSearchData(String title, String year, String director, String language, int start, int limit);
	
	public String deleteGridData(String film_ids);
	
	public String addRecord(String title, String year, String director, String language, String description,
			String special_features, double imdb_rating, int length, String rating);
	
	public String editRecord(String film_id, String title, String year, String director, String language,
			String description, String special_features, double imdb_rating, int length, String rating); 
	
}
