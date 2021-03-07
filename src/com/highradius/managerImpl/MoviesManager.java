package com.highradius.managerImpl;

import java.util.HashMap;

import com.highradius.daoImpl.*;
import com.highradius.manager.MovieManagerInterface;

public class MoviesManager implements MovieManagerInterface{

//	private GridLoadDao glDao = new GridLoadDao();
//	private DeleteRecordsDao drDao = new DeleteRecordsDao();
//	private SearchGridDao sDao = new SearchGridDao();
//	private AddEditRecordDao aeDao = new AddEditRecordDao();
	
	private GridLoadDao glDao;
	private AddEditRecordDao aeDao;
	
	public GridLoadDao getGlDao() {
		return glDao;
	}

	public void setGlDao(GridLoadDao glDao) {
		this.glDao = glDao;
	}

	public AddEditRecordDao getAeDao() {
		return aeDao;
	}

	public void setAeDao(AddEditRecordDao aeDao) {
		this.aeDao = aeDao;
	}

	public HashMap<String, Object> fetchGridData(int start, int limit) {
		return glDao.fetchGridData(start, limit);
	}
	
	public HashMap<String, Object> fetchLangData() {
		return glDao.fetchLangData();
	}
	
	public HashMap<String, Object> fetchRatingData() {
		return glDao.fetchRatingData();
	}
	
	public HashMap<String, Object> fetchFeaturesData() {
		return glDao.fetchFeaturesData();
	}
	
	public HashMap<String, Object> fetchSearchData(String title, String year, String director, String language, int start, int limit) {
		return glDao.fetchSearchData(title, year, director, language, start, limit);
	}
	
	public String deleteGridData(String film_ids) {
		return aeDao.deleteGridData(film_ids);
	}

	public String addRecord(String title, String year, String director, String language,
			String description, String special_features, double imdb_rating, int length, String rating) {
		return aeDao.addRecord(title, year, director, language, description, special_features, imdb_rating, length, rating);
	}
	
	public String editRecord(String film_id, String title, String year, String director, String language,
			String description, String special_features, double imdb_rating, int length, String rating) {
		return aeDao.editRecord(film_id, title, year, director, language, description, special_features, imdb_rating, length, rating);
	}
	
}
