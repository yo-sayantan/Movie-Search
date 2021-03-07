package com.highradius.action;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONObject;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.highradius.manager.MovieManagerInterface;
import com.highradius.managerImpl.MoviesManager;

public class MoviesAction {
	
	private String success;
	private MoviesManager manager;
	private Object moviesList;
	private Object langList;
	private Object ratingList;
	private Object featuresList;
	private long totalcount;
	private int start, limit;
	private String film_ids;
	
	private String title;
	private String year;
	private String director;
	private String language;
	private String film_id;
	private String description;
	private String special_features;
	private String rating;
	private int length;
	private double imdb_rating;
	
	public MoviesManager getManager() {
		return manager;
	}
	public void setManager(MoviesManager manager) {
		this.manager = manager;
	}
	public Object getMoviesList() {
		return moviesList;
	}
	public void setMoviesList(Object moviesList) {
		this.moviesList = moviesList;
	}
	public Object getLangList() {
		return langList;
	}
	public void setLangList(Object langList) {
		this.langList = langList;
	}
	public Object getRatingList() {
		return ratingList;
	}
	public void setRatingList(Object ratingList) {
		this.ratingList = ratingList;
	}
	public Object getFeaturesList() {
		return featuresList;
	}
	public void setFeaturesList(Object featuresList) {
		this.featuresList = featuresList;
	}
	public long getTotalcount() {
		return totalcount;
	}
	public void setTotalcount(long totalcount) {
		this.totalcount = totalcount;
	}
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	public int getLimit() {
		return limit;
	}
	public void setLimit(int limit) {
		this.limit = limit;
	}
	public String getFilm_ids() {
		return film_ids;
	}
	public void setFilm_ids(String film_ids) {
		this.film_ids = film_ids;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getYear() {
		return year;
	}
	public void setYear(String year) {
		this.year = year;
	}
	public String getDirector() {
		return director;
	}
	public void setDirector(String director) {
		this.director = director;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public String getFilm_id() {
		return film_id;
	}
	public void setFilm_id(String film_id) {
		this.film_id = film_id;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getSpecial_features() {
		return special_features;
	}
	public void setSpecial_features(String special_features) {
		this.special_features = special_features;
	}
	public String getRating() {
		return rating;
	}
	public void setRating(String rating) {
		this.rating = rating;
	}
	public int getLength() {
		return length;
	}
	public void setLength(int length) {
		this.length = length;
	}
	public double getImdb_rating() {
		return imdb_rating;
	}
	public void setImdb_rating(double imdb_rating) {
		this.imdb_rating = imdb_rating;
	}
	ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
	MovieManagerInterface managerInt = (MovieManagerInterface) context.getBean("MovieManagerID");
	
	public String MovieGridLoad() {
//		setManager(new MoviesManager());
//		HashMap<String, Object> map = getManager().fetchGridData(start, limit);
		
		HashMap<String, Object> map = managerInt.fetchGridData(start, limit);
		setMoviesList(map.get("data"));
		setTotalcount((long) map.get("total"));
		return "success";
	}
	
	public String LangLoad() {
//		setManager(new MoviesManager());
//		HashMap<String, Object> map = getManager().fetchLangData();
		
		HashMap<String, Object> map = managerInt.fetchLangData();
		setLangList(map.get("data"));
		return "success";
	}
	
	public String RatingLoad() {
//		setManager(new MoviesManager());
		HashMap<String, Object> map = managerInt.fetchRatingData();
		
		setRatingList(map.get("data"));
		return "success";
	}
	
	public String SpecialFeaturesLoad() {
//		setManager(new MoviesManager());
		HashMap<String, Object> map = managerInt.fetchFeaturesData();
		
		setFeaturesList(map.get("data"));
		return "success";
	}
	
	public String SearchGrid() {
//		setManager(new MoviesManager());
		HashMap<String, Object> map = managerInt.fetchSearchData(title, year, director, language, start, limit);
		
		setMoviesList(map.get("data"));
		setTotalcount((long) map.get("total"));
//		success = true;
		return "success";
	}
	
	public String DeleteRecord() {
//		setManager(new MoviesManager());
		success = managerInt.deleteGridData(film_ids);
		return success;
	}
	
	public String AddMovieRecord() {
//		setManager(new MoviesManager());
		success = managerInt.addRecord(title, year, director, language, description, special_features, imdb_rating, length, rating);
		return success;
	}
	
	public String EditMovieRecord() {
//		setManager(new MoviesManager());
		success = managerInt.editRecord(film_id, title, year, director, language, description, special_features, imdb_rating, length, rating);
		return success;
	}

}
