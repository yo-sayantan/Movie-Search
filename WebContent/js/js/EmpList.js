Ext.onReady(function() {
	var modUrl = "GridLoad";
	var LangStore = new Ext.data.JsonStore({
	    storeId: 'LangStore',
		fields: [{
			name: 'language_id',
			type: 'int'
		},{
			name: 'name',
			type: 'string'
		}],
	    proxy: {
	        type: 'ajax',
	        url: "LanguageLoad",
	        reader: {
	            type: 'json',
				rootProperty: 'langList',
	        }
	    },
	});
	
	var RatingStore = new Ext.data.JsonStore({
	    storeId: 'RatingStore',
		fields: [{
			name: 'rating',
			type: 'string'
		}],
 		proxy: {
            type: 'ajax',
			url: "RatingsLoad",
            reader: {
                type: 'json',
                rootProperty: 'ratingList',
            }
        },
	});
	
	var FeaturesStore = new Ext.data.JsonStore({
	    storeId: 'FeaturesStore',
		fields: [{
			name: 'features',
			type: 'string'
		},{
			name: 'id',
			type: 'string'
		}],
 		data : [
	        {"id": "Trailers", "features": "Trailers"},
	        {"id": "Commentaries", "features": "Commentaries"},
	        {"id": "Deleted Scenes", "features": "Deleted Scenes"},
	        {"id": "Behind the Scenes", "features": "Behind the Scenes"},
	    ]
	});
	
	var itemsPerPage = 20;
	var filterPanel = Ext.create('Ext.form.Panel', {
		title: 'Movie Search',
		id: 'searchPanel',
		renderTo: Ext.getBody(),
		frame: false,
		border: false,
		resizable: true,
		layout: {
			type: 'vbox',
			align: 'center',
			width: '100% fixed',
			pack: 'center',
		},
		height: '35vh',
		items: [{
			defaults: {
				layout: 'form',
				xtype: 'container',
				width: 'fixed',
				padding: '50 50 50 50',
			},
			layout: 'hbox',
			items: [{
				items: [{
					fieldLabel: 'Movie Name',
					name: 'title',
					id: 'title',
					xtype: 'textfield',
				}, {
					fieldLabel: 'Release Year',
					name: 'year',
					id: 'year',
					xtype: 'textfield',
					type: 'date',
				}]
			}, {
				items: [{
					fieldLabel: 'Director Name',
					name: 'director',
					id: 'director',
					xtype: 'textfield',
				}, {
					fieldLabel: 'Language',
					name: 'language',
					id: 'language',
					xtype: 'combo',
		            emptyText: 'Select',
		            store: LangStore,
		            displayField: 'name',
					valueField: 'name',
					anchor: '100%',
					forceSelection: true,
					editable: false
				}]
			}],
		}],
		buttonAlign: 'center',
		buttons: [{
			text: 'Search',
			id: 'search',
			pageSize: itemsPerPage,
			handler: function(){
				modUrl = "SearchMovie";
            	Ext.Ajax.request({
					type: 'ajax',
		            url: modUrl,
					enablePaging: true,
					params: {
						start: 0,
						limit: itemsPerPage,
						title: Ext.getCmp('title').getValue(),
						year: Ext.getCmp('year').getValue(),
						director: Ext.getCmp('director').getValue(),
						language: Ext.getCmp('language').getValue(),
					},
					reader: {
		                type: 'json',
		                rootProperty: 'movieSearchList',
						totalProperty: 'totalcount'
		            },
					success: function(response) {
                    	var data = Ext.decode(response.responseText).moviesList;
						console.log(data);
                        gridStore.loadData(data);
                    },
					failure: function(response) {
						Ext.Msg.alert('Failed', 'Search Operation Failed.');						
					}
				})
			},
		}, {
			text: 'Reset',
			handler: function() {
				modUrl = "GridLoad";
				filterPanel.getForm().reset();
				gridStore.load();
			}
		}]
	});
    
	function AddEditRecords() {
		var records = gridPanel.getSelectionModel().getSelection();
	    if(records.length) {
	    	var record = records[0];
	    	var filmId = record.get('film_id');    
	    }
		var editTitle = Ext.getCmp('title1').getValue();
		var editYear = Ext.getCmp('year1').getValue();
		var editDir = Ext.getCmp('dirname1').getValue();
		var editLang = Ext.getCmp('language1').getValue();
		var editPlot = Ext.getCmp('plot1').getValue();
		var editFeature = Ext.getCmp('features1').getValue();
		var editImdb = Ext.getCmp('imdb1').getValue();
		var editlength = Ext.getCmp('length1').getValue();
		var editrating = Ext.getCmp('rating1').getValue();
		console.log(editFeature);
		if (editFeature == null)
		    Ext.Msg.alert('Warning', 'Select values from drop-down only');
		else {
			if (editFeature.length === 1)
				sp_features = editFeature[0];
			else if (editFeature.length > 1) {
				sp_features = editFeature[0];
				for (i = 1; i < editFeature.length; i++)
					sp_features += "," + editFeature[i];
			}
		}
		console.log(sp_features);
    	Ext.Ajax.request({
			url: modUrl,
			params: {
				'film_id': filmId,
				'title': editTitle,
				'year': editYear,
				'director': editDir,
				'language': editLang,
				'description': editPlot,
				'special_features': sp_features,
				'imdb_rating': editImdb,
				'length': editlength,
				'rating': editrating,
			},
			success: function(response, action) {
				RecordsWin.hide();
				Ext.Msg.alert('Success', 'Record updated',
					fn = function(btn) {
						if (btn == "ok")
							gridStore.load();
					});
			},
			failure: function(form, action) {
				switch (action.failureType) {
					case Ext.form.action.Action.CLIENT_INVALID:
						Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
						break;
					case Ext.form.action.Action.CONNECT_FAILURE:
						Ext.Msg.alert('Failure', 'Ajax communication failed');
						break;
					case Ext.form.action.Action.SERVER_INVALID:
						Ext.Msg.alert('Failure', 'Server Invalid');
				}
			}
		});
	}
    
	Ext.define('MovieModel', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'film_id',
			type: 'string'
		}, {
			name: 'title',
			type: 'string'
		}, {
			name: 'description',
			type: 'string'
		}, {
			name: 'release_year',
			type: 'int'
		}, {
			name: 'length',
			type: 'int'
		}, {
			name: 'rating',
			type: 'string'
		}, {
			name: 'special_features',
			type: 'string'
		}, {
			name: 'imdb_rating',
			type: 'float'
		}, {
			name: 'country',
			type: 'string'
		}, {
			name: 'language',
			type: 'string'
		}, {
			name: 'director',
			type: 'string'
		}, {
			name: 'film_category',
			type: 'string'
		}]
	});

	var gridStore = Ext.create('Ext.data.Store', {
		extend: 'Ext.data.Store',
		storeId: 'gridStore',
		model: 'MovieModel',
		loadMask: 'true',
        autoLoad: true,
        autoSync: true,
		remoteSort: true,
		remoteFilter: true,
        pageSize: itemsPerPage,
        proxy: {
            type: 'ajax',
            url: modUrl,
            enablePaging: true,
			params: {
				start: 0,
				limit: itemsPerPage,
			},
            reader: {
                type: 'json',
                rootProperty: 'moviesList',
				totalProperty: 'totalcount'
            }
        },
	});
	
//	gridStore.load({
//		params: {
//			start: 0,
//			limit: itemsPerPage,
//		},
//	});

	var Records = Ext.create('Ext.form.Panel', {
		layout: 'form',
		align: 'center',
		width: 500,
		height: 600,
		bodyPadding: 20,
		items: [{
			defaults: {
				layout: 'form',
				xtype: 'container',
				padding: '0 10 10 10',
			},
			fieldLabel: 'Movie Name',
				id: 'title1',
				name: 'title1',
				xtype: 'textfield',
				submitEmptyText: 'false',
			}, {
				fieldLabel: 'Release Year',
				id: 'year1',
				name: 'year1',
				xtype: 'textfield',
				submitEmptyText: 'false',
				maskRe: /[0-9]/,
                validator: function(v) {
                    return /^-?[0-9]*(\.[0-9]{1,2})?$/.test(v)? true : 'Only positive/negative float (x.yy)/int formats allowed!';
                },
                listeners: {
                    change: function(e, text, prev) {
                        if (!/^-?[0-9]*(\.[0-9]{0,2})?$/.test(text)) {   
                            this.setValue(prev);
                        }
                    }
                }
			}, {
				fieldLabel: 'Language',
				name: 'language1',
				id: 'language1',
				xtype: 'combo',
	            emptyText: 'Select',
	            store: LangStore,
	            displayField: 'name',
	            submitEmptyText: 'false',
				editable: false
			}, {
				fieldLabel: 'IMDB Rating',
				id: 'imdb1',
				name: 'imdb_rating1',
				xtype: 'textfield',
				maskRe: /[0-9.]/,
                validator: function(v) {
                    return /^-?[0-9]*(\.[0-9]{1,2})?$/.test(v)? true : 'Only positive/negative float (x.yy)/int formats allowed!';
                },
                listeners: {
                    change: function(e, text, prev) {
                        if (!/^-?[0-9]*(\.[0-9]{0,2})?$/.test(text)) {   
                            this.setValue(prev);
                        }
                    }
                }
			}, {
				fieldLabel: 'Director',
				id: 'dirname1',
				name: 'director1',
				xtype: 'textfield',
			}, {
				fieldLabel: 'Plot',
				id: 'plot1',
				name: 'description1',
				xtype: 'textareafield',
			}, {
				fieldLabel: 'Length',
				id: 'length1',
				name: 'length1',
				xtype: 'textfield',
				submitEmptyText: 'false',
				maskRe: /[0-9]/,
                validator: function(v) {
                    return /^-?[0-9]*(\.[0-9]{1,2})?$/.test(v)? true : 'Only positive/negative float (x.yy)/int formats allowed!';
                },
                listeners: {
                    change: function(e, text, prev) {
                        if (!/^-?[0-9]*(\.[0-9]{0,2})?$/.test(text)) {   
                            this.setValue(prev);
                        }
                    }
                }
			}, {
				fieldLabel: 'Rating',
				id: 'rating1',
				name: 'rating1',
				xtype: 'combo',
	            emptyText: 'Select',
	            store: RatingStore,
	            displayField: 'rating',
	            submitEmptyText: 'false',
				editable: false
			}, {
				fieldLabel: 'Special Features',
				id: 'features1',
				name: 'special_features1',
				xtype: 'tagfield',
	            emptyText: 'Select',
	            store: FeaturesStore,
				queryMode: 'local',
	            displayField: 'features',
				valueField: 'id',
				createNewOnEnter: true,
		        createNewOnBlur: true,
		        filterPickList: true,
		        queryMode: 'local',
		        publishes: 'value',
				width: 300,
//				multiSelect:true
		}],
		buttonAlign: 'center',
		buttons: [{
			text: 'Save',
			id: 'Save',
			handler: AddEditRecords
		}, {
			text: 'Close',
			id: 'close1',
			listeners: {
				click: function() {
					RecordsWin.hide();
				}
			}
		}]
	});
	
	var RecordsWin = Ext.create('Ext.window.Window', {
		title: 'Edit Movie Details',
		id: 'RecordsWind', 
		closable: true,
		frame: false,
		border: false,
		resizable: true,
		draggable: true,
		floating: true,
		closeAction: 'hide',
		items: [Records]
	});
	
	var rec;
	var film_ids, selection, sp_features, features_selection;
	var gridPanel = Ext.create('Ext.grid.Panel', {
		title: 'Movies Grid',
		store: gridStore,
		id: 'studgrid',
		height: '70vh',
		stripeRows: true,
		collapsible: true,
		enableColumnMove: true,
		enableColumnResize: true,
		enablePaging: true,
		pageSize: itemsPerPage,
		columns: [{
			text: 'Title',
			dataIndex: 'title',
			flex: 1.5
		}, {
			text: 'Released Year',
			dataIndex: 'release_year',
			flex: 1
		}, {
			text: 'Director',
			dataIndex: 'director',
			flex: 1
		}, {
			text: 'imdbRating',
			dataIndex: 'imdb_rating',
		}, {
			text: 'Rated',
			dataIndex: 'rating'
		}, {
			text: 'Language',
			dataIndex: 'language',
			flex: 1
		}, {
			text: 'Country',
			dataIndex: 'country',
			flex: 1
		}, {
			text: 'Type',
			dataIndex: 'film_category',
			flex: 1
		}, {
			text: 'Special Features',
			dataIndex: 'special_features',
			flex: 2
		}, {
			text: 'Length (in mins)',
			dataIndex: 'length',
			flex: 1
		}],
		viewConfig: {
			deferEmptyText: false,
			emptyText: 'No data Available',
		},
//		bbar: {
//            xtype: 'pagingtoolbar',
//			dock: 'top',
//            pageSize: 10,
//            store: store,
//            displayInfo: true,
//        },
		dockedItems: [{
			xtype: 'pagingtoolbar',
			dock: 'top',
			displayInfo: true,
			store: gridStore,
			pageSize: itemsPerPage,
			items: [{
				text: 'Select All',
				id: 'selectAll',
				xtype: 'button',
				iconCls: 'fa fa-check-circle',
				handler: function() {
					Ext.getCmp('studgrid').getSelectionModel().selectAll();
					Ext.getCmp('selectAll').setDisabled(true);
					Ext.getCmp('deselectAll').setDisabled(false);
				}
			}, {
				text: 'Deselect All',
				id: 'deselectAll',
				xtype: 'button',
				disabled: true,
				iconCls: 'fa fa-times-circle',
				handler: function() {
					Ext.getCmp('studgrid').getSelectionModel().deselectAll();
					Ext.getCmp('deselectAll').setDisabled(true);
					Ext.getCmp('selectAll').setDisabled(false);
				}
			}, {
				text: 'Add',
				id: 'add',
				xtype: 'button',
				iconCls: 'fa fa-plus',
				handler: function() {
					modUrl = "AddRecords";
					Records.getForm().reset();
					RecordsWin.show();
				}
			}, {
				text: 'Edit',
				id: 'edit',
				xtype: 'button',
				disabled: true,
				iconCls: 'fa fa-edit',
				handler: function() {
					modUrl = "EditRecords";
					RecordsWin.show();
					Ext.getCmp('title1').setValue(rec.data.title);
					Ext.getCmp('year1').setValue(rec.data.release_year);
					Ext.getCmp('dirname1').setValue(rec.data.director);
					Ext.getCmp('language1').setValue(rec.data.language);
					Ext.getCmp('plot1').setValue(rec.data.description);
					Ext.getCmp('features1').setValue(rec.data.special_features);
					Ext.getCmp('imdb1').setValue(rec.data.imdb_rating);
					Ext.getCmp('rating1').setValue(rec.data.rating);
					Ext.getCmp('length1').setValue(rec.data.length);
				}
			}, {
				text: 'Delete',
				id: 'delete',
				xtype: 'button',
				disabled: true,
				iconCls: 'fa fa-trash',
				handler: function() {
					if (selection.length === 1)
						film_ids = selection[0].data.film_id;
					else if (selection.length > 1) {
						film_ids = selection[0].data.film_id;
						for (i = 1; i < selection.length; i++)
							film_ids += "," + selection[i].data.film_id;
					}
					console.log(film_ids);
					Ext.MessageBox.show({
						title: 'Warning',
						msg: 'Do you want to delete the record(s) ?',
						width: 300,
						buttons: Ext.MessageBox.YESNO,
						icon: Ext.MessageBox.WARNING,
						fn: function(btn) {
							if (btn == "yes") {
								Ext.Ajax.request({
						            type: 'ajax',
						            url: "DeleteRecords",
									params: {
										film_ids: film_ids,
									},
									success: function(response) {
										Ext.Msg.alert('Success', 'Record(s) Deleted',
											fn = function(btn) {
												if (btn == "ok")
													gridStore.load();
											});
									},
									failure: function(response) {
										Ext.Msg.alert('Failed', 'Record(s) Delete Failed.');
									}
								})
							}
						}
					})
				}
			}],
		}],
		width: 'auto',
		height: '60vh',
		renderTo: Ext.getBody(),
		selModel: {
			checkOnly: false,
			injectCheckbox: 'first',
			mode: 'SIMPLE'
		},
		selType: 'checkboxmodel',
		reader: {
			type: 'json',
			rootProperty: 'data',
			totalProperty: 'total',
		},
		listeners: {
			select: function(selModel, record, index, options) {
				selection = Ext.getCmp('studgrid').getSelection();
				rec = record;
				if (selection.length) {
					Ext.getCmp('deselectAll').setDisabled(false);
					Ext.getCmp('delete').setDisabled(false);
				}
				if (selection.length == gridStore.getTotalCount())
					Ext.getCmp('selectAll').setDisabled(true);
				if (selection.length == 1)
					Ext.getCmp('edit').setDisabled(false);
				if (selection.length > 1)
					Ext.getCmp('edit').setDisabled(true);
			},
			deselect: function(selModel, record, index, options) {
				selection = Ext.getCmp('studgrid').getSelection();
				if (selection.length == 0) {
					Ext.getCmp('deselectAll').setDisabled(true);
					Ext.getCmp('selectAll').setDisabled(false);
					Ext.getCmp('edit').setDisabled(true);
					Ext.getCmp('delete').setDisabled(true);
				}
				if (selection.length == 1)
					Ext.getCmp('edit').setDisabled(false);
				if (selection.length)
					Ext.getCmp('selectAll').setDisabled(false);
			}
		}
	});

	

	
})

