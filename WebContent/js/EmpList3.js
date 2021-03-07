Ext.onReady(function() {
	var LangStore = new Ext.data.Store({
	    storeId: 'langStore',
//		fields: [{
//			name: 'name',
//			type: 'string'
//		}],
		fields: ['name'],
	    autoLoad: true,
		autoSync: true,
 		proxy: {
            type: 'ajax',
            url: './LanguageLoad.action',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                rootProperty: 'langList',
				totalProperty: 'totalcount'
            }
        },
	});
	
	var RatingStore = new Ext.data.Store({
	    storeId: 'ratingStore',
//		fields: [{
//			name: 'rating',
//			type: 'string'
//		}],
//		fields: [
//             {name: 'rating', type: 'string'}
//        ],
//	    autoLoad: true,
//		autoSync: true,
// 		proxy: {
//            type: 'ajax',
//            url: './RatingsLoad.action',
//            actionMethods: {
//                read: 'POST'
//            },
//            reader: {
//                type: 'json',
//                root: 'ratingList',
////				totalProperty: 'totalcount'
//            }
//        },
		data: [
            ['G', 'G'],
            ['PG', 'PG'],
            ['PG-13', 'PG-13'],
            ['R', 'R'],
            ['NC-17', 'NC-17'],	
        ],
        fields: ['rating', 'rating']
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
				}]
			}],
		}],
		buttonAlign: 'center',
		buttons: [{
			text: 'Search',
			id: 'search',
			pageSize: itemsPerPage,
			handler: function(){
            	Ext.Ajax.request({
					type: 'ajax',
		            url: './SearchMovie.action',
		            actionMethods: {
		                read: 'POST'
		            },
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
						Ext.Msg.alert('Failed', 'Record(s) Update Failed.');						
					}
				})
			},
		}, {
			text: 'Reset',
			handler: function() {
				filterPanel.getForm().reset();
				gridStore.load();
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

	var gridStore = Ext.create('Ext.data.Store', {
		extend: 'Ext.data.Store',
		storeId: 'gridStore',
		model: 'MovieModel',
		loadMask: 'true',
        autoLoad: true,
        autoSync: true,
        pageSize: itemsPerPage,
        proxy: {
            type: 'ajax',
            url: './GridLoad.action',
            enablePaging: true,
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                rootProperty: 'moviesList',
				totalProperty: 'totalcount'
            }
        },
	});
	
	gridStore.load({
		params: {
			start: 0,
			limit: itemsPerPage,
		}
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
			}, {
				fieldLabel: 'Release Year',
				id: 'year2',
				name: 'year2',
				xtype: 'textfield',
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
				name: 'language2',
				id: 'language2',
				xtype: 'combo',
	            emptyText: 'Select',
	            store: LangStore,
	            displayField: 'name',
	            submitEmptyText: 'false',
			}, {
				fieldLabel: 'IMDB Rating',
				id: 'imdb2',
				name: 'imdb_rating2',
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
				id: 'dirname2',
				name: 'director2',
				xtype: 'textfield',
			}, {
				fieldLabel: 'Plot',
				id: 'plot2',
				name: 'description2',
				xtype: 'textareafield',
			}, {
				fieldLabel: 'Length',
				id: 'length2',
				name: 'length2',
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
				id: 'rating2',
				name: 'rating2',
				xtype: 'combo',
	            emptyText: 'Select',
	            store: RatingStore,
//	            submitEmptyText: 'false',
				displayField: 'rating',
				valueField: 'rating',
				queryMode: 'local',
			}, {
				fieldLabel: 'Special Features',
				id: 'features2',
				name: 'special_features2',
				xtype: 'textfield'
		}],
		buttonAlign: 'center',
		buttons: [{
			text: 'Add',
			id: 'Add2',
			handler: function(){
				var addTitle = Ext.getCmp('title2').getValue();
				var addYear = Ext.getCmp('year2').getValue();
				var addDir = Ext.getCmp('dirname2').getValue();
				var addLang = Ext.getCmp('language2').getValue();
				var addPlot = Ext.getCmp('plot2').getValue();
				var addFeature = Ext.getCmp('features2').getValue();
				var addImdb = Ext.getCmp('imdb2').getValue();
				var addLength = Ext.getCmp('length2').getValue();
				var addRating = Ext.getCmp('rating2').getValue();
            	Ext.Ajax.request({
					url: './GridServlet',
					method: 'POST',
					params: {
						'query': "Add",
						'title': addTitle,
						'year': addYear,
						'director': addDir,
						'language': addLang,
						'description': addPlot,
						'special_features': addFeature,
						'imdb_rating': addImdb,
						'length': addLength,
						'rating': addRating,
					},
					success: function(response, action) {
						AddRecords.getForm().reset();
						AddRecordsWin.hide();
						gridStore.load();
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
			id: 'close2',
			listeners: {
				click: function() {
					AddRecordsWin.hide();
				}
			}
		}]
	});
	
	var records = Ext.create('Ext.form.Panel', {
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
			}, {
				fieldLabel: 'Special Features',
				id: 'features1',
				name: 'special_features1',
				xtype: 'textfield'
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
						'length': editlength,
						'rating': editrating,
					},
					success: function(response, action) {
						RecordsWin.hide();
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
					RecordsWin.hide();
				}
			}
		}]
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
		id: 'RecordsWind', 
		closable: true,
		frame: false,
		border: false,
		resizable: true,
		draggable: true,
		floating: true,
		closeAction: 'hide',
		items: [records]
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
					AddRecordsWin.show();
				}
			}, {
				text: 'Edit',
				id: 'edit',
				xtype: 'button',
				disabled: true,
				iconCls: 'fa fa-edit',
				handler: function() {
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
//									url: './GridServlet',
//									type: 'ajax',
//									method: 'POST',
						            type: 'ajax',
						            url: './DeleteRecords.action',
						            actionMethods: {
						                read: 'POST',
						            },
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

