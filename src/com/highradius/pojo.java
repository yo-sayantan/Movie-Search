package com.highradius;

public class pojo {
	
//	DataBase column headers - POJO Class
	private int film_id;
	private String title;
	private String description;
	private int release_year;
	private int length;
	private String rating;
	private String film_category;
	private float imdb_rating;
	private String country;
	private String language;
	private String director;
	private int language_id;
	private String name;
	private String special_features;
	private String category_id;
	
//	Getters and Setters of the POJO Class variables
	public int getFilm_id() {
		return film_id;
	}
	public void setFilm_id(int film_id) {
		this.film_id = film_id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getRelease_year() {
		return release_year;
	}
	public void setRelease_year(int release_year) {
		this.release_year = release_year;
	}
	public String getRating() {
		return rating;
	}
	public void setRating(String rating) {
		this.rating = rating;
	}
	public float getImdb_rating() {
		return imdb_rating;
	}
	public void setImdb_rating(float imdb_rating) {
		this.imdb_rating = imdb_rating;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public int getLength() {
		return length;
	}
	public void setLength(int length) {
		this.length = length;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public String getDirector() {
		return director;
	}
	public void setDirector(String director) {
		this.director = director;
	}
	public String getFilm_category() {
		return film_category;
	}
	public void setFilm_category(String film_category) {
		this.film_category = film_category;
	}
	public int getLanguage_id() {
		return language_id;
	}
	public void setLanguage_id(int language_id) {
		this.language_id = language_id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSpecial_features() {
		return special_features;
	}
	public void setSpecial_features(String special_features) {
		this.special_features = special_features;
	}
	public String getCategory_id() {
		return category_id;
	}
	public void setCategory_id(String category_id) {
		this.category_id = category_id;
	}
	
}