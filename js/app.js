var Quotes = {
			index: window.localStorage.getItem("Quotes:index"),
			$section: document.getElementById("quotes-table"),
			$form: document.getElementById("quotes-form"),
			$button_save: document.getElementById("quotes-op-save"),
			$button_discard: document.getElementById("clear-quotes"),

			init: function() {
				// initialize storage index
				if (!Quotes.index) {
					window.localStorage.setItem("Quotes:index", Quotes.index = 1);
				}

				// initialize form
				Quotes.$form.reset();
				Quotes.$button_discard.addEventListener("click", function(event){
					localStorage.clear();
					Quotes.$form.reset();
					
					// this.append(document.createTextNode("- Referesh Page"));
					// this.disabled = true;
				}, true);
				Quotes.$form.addEventListener("submit", function(event) {
					var entry = {
						id: parseInt(this.id_entry.value),
						quote: this.quote.value,
						reference: this.reference.value
					};
					if (entry.id == 0) { // add
						Quotes.storeAdd(entry);
						Quotes.QuoteAdd(entry);
					}
					else { // edit
						Quotes.storeEdit(entry);
						Quotes.tableEdit(entry);
					}

					this.reset();
					this.id_entry.value = 0;
					event.preventDefault();
				}, true);

				// initialize table
				if (window.localStorage.length - 1) {
					var quotes_list = [], i, key;
					for (i = 0; i < window.localStorage.length; i++) {
						key = window.localStorage.key(i);
						if (/Quotes:\d+/.test(key)) {
							quotes_list.push(JSON.parse(window.localStorage.getItem(key)));
						}
					}

					if (quotes_list.length) {
						quotes_list
							.sort(function(a, b) {
								return 0.5 - Math.random();
							})
							.forEach(Quotes.QuoteAdd);
					}
				}
				Quotes.$section.addEventListener("click", function(event) {
					var op = event.target.getAttribute("data-op");
					if (/edit|remove/.test(op)) {
						var entry = JSON.parse(window.localStorage.getItem("Quotes:"+ event.target.getAttribute("data-id")));
						if (op == "edit") {
							Quotes.$form.quote.value = entry.quote;
							Quotes.$form.reference.value = entry.reference;
							Quotes.$form.id_entry.value = entry.id;
						}
						else if (op == "remove") {
							if (confirm('Are you sure you want to remove "'+ entry.reference +'" from your Quotes?')) {
								Quotes.storeRemove(entry);
								Quotes.QuoteRemove(entry);
							}
						}
						event.preventDefault();
					}
				}, true);
			},

			storeAdd: function(entry) {
				entry.id = Quotes.index;
				window.localStorage.setItem("Quotes:index", ++Quotes.index);
				window.localStorage.setItem("Quotes:"+ entry.id, JSON.stringify(entry));
			},
			storeEdit: function(entry) {
				window.localStorage.setItem("Quotes:"+ entry.id, JSON.stringify(entry));
			},
			storeRemove: function(entry) {
				window.localStorage.removeItem("Quotes:"+ entry.id);
			},

			QuoteAdd: function(entry) {
				var $sc = document.createElement("div"), $h1, key;
				for (key in entry) {
					if (entry.hasOwnProperty(key)) {
						$h1 = document.createElement("h1");
						$h1.appendChild(document.createTextNode(entry[key]));
						$sc.appendChild($h1);
					}
				}
				$h1 = document.createElement("h1");
				$h1.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
				$sc.appendChild($h1);
				$sc.setAttribute("id", "entry-"+ entry.id);
				$sc.setAttribute("class", "entry")
				Quotes.$section.appendChild($sc);
			},
			QuoteEdit: function(entry) {
				var $sc = document.getElementById("entry-"+ entry.id), $h1, key;
				$sc.innerHTML = "";
				for (key in entry) {
					if (entry.hasOwnProperty(key)) {
						$h1 = document.createElement("h1");
						$h1.appendChild(document.createTextNode(entry[key]));
						$sc.appendChild($h1);
					}
				}
				$h1 = document.createElement("h1");
				$h1.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
				$sc.appendChild($h1);
			},
			QuoteRemove: function(entry) {
				Quotes.$section.removeChild(document.getElementById("entry-"+ entry.id));
			}
		};
		Quotes.init();