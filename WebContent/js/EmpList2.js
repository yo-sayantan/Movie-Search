

var LangMemoryStore = Ext.create('Ext.data.Store', {
	fields: [{
		name: 'name',
		type: 'string'
	}],
	storeId: 'LangMemoryStore',
	autoLoad:true,
    proxy: {
       	type: 'memory',
       	reader: {rootProperty: "data"}												     
    },
	pageSize: 10					   
});

Ext.onReady(function() {
	
	var LangStore = Ext.data.Store({
    storeId: 'langStore',
	fields: [{
		name: 'name',
		type: 'string'
	}],
    autoLoad: true,
	handler:function(){
		Ext.Ajax.request({
			url: './ExtraServlet',
			method: 'POST',
			params: {
				query: "LoadLang",
			},
			reader: {
//	            type: 'json',
				rootProperty: 'data',
				totalProperty: 'total'
	        },
		})
	},
//    proxy: {
//        type: 'ajax',
//		method: 'POST',
//        url: './ExtraServlet',
//		params: {
//			'query': "LoadLang"
//		},
//        reader: {
//            type: 'json',
//			rootProperty: 'data',
//			totalProperty: 'total'
//        },
//    },
//	listeners: {
//		load: function () {
//    		LangMemoryStore.getProxy().setData(LangStore.getRange());
//	    	LangMemoryStore.load();
//		}
//	}
});
	
	var itemsPerPage = 10;
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
			height: '55vh',
			pack: 'center'
		},
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
					fieldlabel: 'Release Year',
					name: 'year',
					id: 'year',
					xtype: 'textfield',
					type: 'date',
					format: 'y'
					//renderer: Ext.util.Format.dateRenderer('Y'),
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
		            submitEmptyText: 'false',
				}]
			}],
		}],
		buttonAlign: 'center',
		buttons: [{
			text: 'Search',
			id: 'search',
			pageSize: 'itemsPerPage',
			handler:function(){
            	Ext.Ajax.request({
					url: './GridServlet',
					type: 'ajax',
					method: 'POST',
					params: {
						query: "Search",
						start: 0,
						limit: 10,
						title: Ext.getCmp('title').getValue(),
					},
					reader: {
						type: 'json',
						rootProperty: 'data',
						totalProperty: 'total',
					},
					success: function(response) {
                    	var data = Ext.decode(response.responseText).data;
                        gridStore.loadData(data);
                    	
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
			                   	Ext.Msg.alert('Failure', action.result.msg);
			           	}
			        }
				})
			},
		}, {
			text: 'Reset',
			handler: function() {
				filterPanel.getForm().reset();
			}
		}]
	});
	
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

	

	var RatingStore = Ext.data.Store({
        storeId: 'ratingStore',
		fields: [{
			name: 'rating',
			type: 'string'
		}],
        autoLoad: true,
        proxy: {
            type: 'ajax',
			method: 'POST',
            url: './ExtraServlet',
			params: {
				query: "LoadRating"
			},
            reader: {
                type: 'json',
				rootProperty: 'data',
				totalProperty: 'total'
            },
        },
    });

	var gridStore = Ext.create('Ext.data.JsonStore', {
		extend: 'Ext.data.Store',
		storeId: 'gridStore',
		model: 'MovieModel',
		autoLoad: {
			start: 0,
			limit: 10
		},
		pageSize: 10,
		autoSync: true,
		proxy: {
			type: 'ajax',
			method: 'GET',
			url: './GridServlet',
			params: {
				query: "Load"
			},
			reader: {
				type: 'json',
				rootProperty: 'data',
				totalProperty: 'total',
			}
		}
	});
	
	gridStore.load({
		params: {
			start: 0,
			limit: 10
		}
	});
	
	var AddRecordsWin = Ext.create('Ext.window.Window', {
		title: 'Add Movie Details',
		id: 'AddRecordsWin', 
		closable: true,
		frame: false,
		border: false,
		resizable: true,
		draggable: true,
		floating: true,
		closeAction: 'hide',
		items: [AddRecords]
	});
	
	var RecordsWin = Ext.create('Ext.window.Window', {
		title: 'Edit Movie Details',
		id: 'RecordsWin', 
		closable: true,
		frame: false,
		border: false,
		resizable: true,
		draggable: true,
		floating: true,
		closeAction: 'hide',
		items: [Records]
	});
	
	var Records = Ext.create('Ext.window.Window', {
		closeAction: 'hide',
		layout: {
			layout: 'vbox',
			align: 'center',
			width: 'fixed',
		},
		autoHeight: true,
		bodyPadding: 20,
				items: [{
			layout: 'hbox',
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
			}, {
				fieldLabel: 'Language',
				name: 'language1',
				id: 'language1',
				xtype: 'combo',
	            emptyText: 'Select',
	            store: LangStore,
	            displayField: 'name',
	            submitEmptyText: 'false',
			}, {
				fieldLabel: 'Type',
				id: 'type1',
				name: 'film_category1',
				xtype: 'textfield',
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
				fieldLabel: 'Special Features',
				id: 'features1',
				name: 'special_features1',
				xtype: 'textfield'
			}, {
				fieldLabel: 'IMDB Rating',
				id: 'imdb1',
				name: 'imdb_rating1',
				xtype: 'textfield',
				submitEmptyText: 'false',
			}, {
				fieldLabel: 'Rating',
				name: 'rating1',
				id: 'rating1',
				xtype: 'combo',
	            emptyText: 'Select',
	            store: RatingStore,
	            displayField: 'name',
	            submitEmptyText: 'false',
		}],
		buttonAlign: 'center',
		buttons: [{
			text: 'Save',
			id: 'Save',
			handler: function(){
				var records = gridPanel.getSelectionModel().getSelection();
	    	    if(records.length) {
	    	    	var record = records[0];
	    	    	var filmId = record.get('film_id');    
	    	    	console.log(filmId);
	    	    }
				var editTitle = Ext.getCmp('title1').getValue();
				var editYear = Ext.getCmp('year1').getValue();
				var editDir = Ext.getCmp('dirname1').getValue();
				var editLang = Ext.getCmp('language1').getValue();
				var editPlot = Ext.getCmp('plot1').getValue();
				var editFeature = Ext.getCmp('features1').getValue();
				var editImdb = Ext.getCmp('imdb1').getValue();
				var editRating = Ext.getCmp('rating1').getValue();
            	Ext.Ajax.request({
					url: './GridServlet',
					method: 'POST',
					params: {
						'query': "Edit",
						'film_id': filmId,
						'title': editTitle,
						'year': editYear,
						'director': editDir,
						'language': editLang,
						'description': editPlot,
						'special_features': editFeature,
						'imdb_rating': editImdb,
//						'title': editType,
//						'rating': editRating,
					},
					success: function(response, action) {
						Records.hide();
						Ext.Msg.alert('Success', 'Record edited',
							fn = function(btn) {
								if (btn == "ok")
									gridStore.load();
							});
					},
					failure: function(form, action) {
						Records.hide();
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
		}, {
			text: 'Close',
			id: 'close',
			listeners: {
				click: function() {
					Records.hide();
				}
			}
		}]
	});
	
	var AddRecords = Ext.create('Ext.form.Panel', {
		layout: {
			layout: 'vbox',
			align: 'center',
			width: 'fixed',
		},
		autoHeight: true,
		bodyPadding: 20,
		items: [{
			layout: 'hbox',
			defaults: {
				layout: 'form',
				xtype: 'container',
				width: 'fixed',
				padding: '0 10 10 10',
			},
			fieldLabel: 'Movie Name',
				id: 'title2',
				name: 'title2',
				xtype: 'textfield',
				submitEmptyText: 'false',
			}, {
				fieldLabel: 'Release Year',
				id: 'year2',
				name: 'year2',
				xtype: 'textfield',
				submitEmptyText: 'false',
			}, {
				fieldLabel: 'Language',
				name: 'language2',
				id: 'language2',
				xtype: 'combo',
	            emptyText: 'Select',
	            store: LangStore,
	            displayField: 'name',
	            submitEmptyText: 'false',
			}, {
				fieldLabel: 'Type',
				id: 'type2',
				name: 'film_category2',
				xtype: 'textfield',
			}, {
				fieldLabel: 'Director',
				id: 'dirname2',
				name: 'director2',
				xtype: 'textfield',
			}, {
				fieldLabel: 'Plot',
				id: 'plot2',
				name: 'description2',
				xtype: 'textareafield',
			}, {
				fieldLabel: 'Special Features',
				id: 'features2',
				name: 'special_features2',
				xtype: 'textareafield'
			}, {
				fieldLabel: 'IMDB Rating',
				id: 'imdb2',
				name: 'imdb_rating2',
				xtype: 'textfield',
				submitEmptyText: 'false',
			}, {
				fieldLabel: 'Rating',
				name: 'rating2',
				id: 'rating2',
				xtype: 'combo',
	            emptyText: 'Select',
	            store: RatingStore,
	            displayField: 'name',
	            submitEmptyText: 'false',
		}],
		buttonAlign: 'center',
		buttons: [{
			text: 'Save',
			id: 'Save1',
			handler: function() {
				Records.submit({
					url: './GridServlet',
					method: 'POST',
					store: 'gridStore',
					params: {
						query: "Add"
					},
					success: function(response, action) {
						Records.hide();
						Ext.Msg.alert('Success', 'Record edited',
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
		}, {
			text: 'Close',
			id: 'close1',
			listeners: {
				click: function() {
					Ext.getCmp('AddRecordsWin').close();
				}
			}
		}],
		listeners: {
			click: function() {
				Records.hide();
			}
		}
	});
	
	var rec;
	var film_ids, selection;
	var gridPanel = Ext.create('Ext.grid.Panel', {
		title: 'Movies Grid',
		store: 'gridStore',
		id: 'studgrid',
		stripeRows: true,
		collapsible: true,
		enableColumnMove: true,
		enableColumnResize: true,
		enablePaging: true,
		columns: [{
//			text: 'Film ID',
//			dataIndex: 'film_id'
//		}, {
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
			flex: 1.5
		}, {
			text: 'Special Features',
			dataIndex: 'special_features',
			flex: 1.5
		}, {
			text: 'Length (in mins)',
			dataIndex: 'length',
			flex: 1
		}],
		viewConfig: {
			deferEmptyText: false,
			emptyText: 'No data Available',
		},
		dockedItems: [{
			xtype: 'pagingtoolbar',
			dock: 'top',
			displayInfo: true,
			store: 'gridStore',
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
//					Ext.getCmp('AddRecordsWin').show();
					AddRecords.show();
				}
			}, {
				text: 'Edit',
				id: 'edit',
				xtype: 'button',
				disabled: true,
				iconCls: 'fa fa-edit',
				handler: function() {
					Ext.getCmp('title1').setValue(rec.data.title);
					Ext.getCmp('year1').setValue(rec.data.release_year);
					Ext.getCmp('dirname1').setValue(rec.data.director);
					Ext.getCmp('language1').setValue(rec.data.language);
					Ext.getCmp('plot1').setValue(rec.data.description);
					Ext.getCmp('features1').setValue(rec.data.special_features);
					Ext.getCmp('imdb1').setValue(rec.data.imdb_rating);
					Ext.getCmp('type1').setValue(rec.data.film_category);
//					Ext.getCmp('id1').setValue(rec.data.film_id);
					Records.show();
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
									url: './GridServlet',
									type: 'ajax',
									method: 'POST',
									params: {
										id: film_ids,
										query: 'Delete',
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
				console.log(rec);
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

