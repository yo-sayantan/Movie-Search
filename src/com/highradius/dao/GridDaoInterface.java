package com.highradius.dao;

import java.util.HashMap;

public interface GridDaoInterface {
	
	public HashMap<String, Object> fetchGridData(int start, int limit);
	
	public HashMap<String, Object> fetchLangData();
	
	public HashMap<String, Object> fetchRatingData();
	
	public HashMap<String, Object> fetchFeaturesData();
	
	public HashMap<String, Object> fetchSearchData(String title, String year, String director, String language, int start, int limit);
	
}
