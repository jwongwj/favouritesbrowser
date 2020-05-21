const ADD_FAVE_ACTION = "addFave";
const EDIT_FAVE_ACTION = "editFave";
const DEL_FAVE_ACTION = "deleteFave";
const DEL_ALL_ACTION = "deleteAll";
const OPEN_URL_ACTION = "openUrl";
var localStorage = window.localStorage;

var app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    value: false,
    menuItems: [
      {
        buttonName: "Add New Favourites",
        method: ADD_FAVE_ACTION,
        icon: "mdi-heart",
      },
      {
        buttonName: "Delete All",
        method: DEL_ALL_ACTION,
        icon: "mdi-delete-variant",
      },
    ],
    listMenu: [
      {
        buttonName: "Edit",
        method: EDIT_FAVE_ACTION,
        icon: "mdi-pencil",
      },
      {
        buttonName: "Delete",
        method: DEL_FAVE_ACTION,
        icon: "mdi-delete-variant",
      },
      {
        buttonName: "Open URL",
        method: OPEN_URL_ACTION,
        icon: "mdi-arrow-top-left-bold-outline",
      },
    ],
    dialog: false,
    item: {
      name: "",
      description: "",
      url: "",
    },
    items: [],
    onEdit: false,
    oldItem: {
      name: "",
      description: "",
      url: "",
    },
    search: "",
  },
  methods: {
    checkItems() {
      if (this.items == "") {
        return true;
      }
      return this.items.length == 0;
    },
    executeMenuAction(action, item) {
      switch (action) {
        case ADD_FAVE_ACTION:
          this.addFave();
          break;

        case EDIT_FAVE_ACTION:
          this.editFave(item);
          break;

        case DEL_FAVE_ACTION:
          this.delFave(item);
          break;
        case DEL_ALL_ACTION:
          this.delAll();
          break;
        case OPEN_URL_ACTION:
          this.navigateURL(item.url);
      }
    },
    delAll() {
      localStorage.clear();
      this.items = [];
    },
    addFave() {
      this.dialog = true;
    },
    navigateURL(url) {
      window.open(url);
    },
    close(revert) {
      if (revert) {
        this.items = this.replaceArray(this.item, this.oldItem, this.items);
      }
      this.item = {
        name: "",
        description: "",
        url: "",
      };
      this.oldItem = {
        name: "",
        description: "",
        url: "",
      };
      this.dialog = false;
      this.onEdit = false;
    },
    save() {
      this.item.url = this.decodeUrl(this.item.url);

      if (this.onEdit == false) {
        this.items.push(this.item);
      } else {
        var index = this.items.indexOf(this.oldItem);
        if (index > -1) {
          // My issue here
          this.$set(this.items, index, this.item);
        }
      }
      localStorage.setItem("faveItems", JSON.stringify(this.items));
      this.close(false);
    },
    getImage(url) {
      return "https://s2.googleusercontent.com/s2/favicons?domain=" + url;
    },
    editFave(item) {
      this.oldItem = item;
      this.item = Object.assign({}, item);
      this.dialog = true;
      this.onEdit = true;
    },
    delFave(item) {
      var index = this.items.indexOf(item);
      if (index > -1) {
        this.items.splice(index, 1);
      }
      localStorage.setItem("faveItems", JSON.stringify(this.items));
    },
    decodeUrl(url) {
      if (url === "") {
        return "www";
      }

      let newUrl = window.decodeURIComponent(url);
      newUrl = newUrl.trim().replace(/\s/g, "");

      if (/^(:\/\/)/.test(newUrl)) {
        return `https${newUrl}`;
      }
      if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
        return `https://${newUrl}`;
      }
      return url;
    },
    replaceArray(oldItem, newItem, array) {
      var index = this.items.indexOf(oldItem);
      if (index > -1) {
        array[index] = newItem;
      }
      return array;
    },
  },
  computed: {
    setFavImg: function () {
      if (this.item.url == "") {
        return "";
      }
      return (
        "https://s2.googleusercontent.com/s2/favicons?domain=" + this.item.url
      );
    },
    filteredList() {
      return this.items.filter((i) => {
        if (i == null) {
          return;
        }
        return (
          (i.url != null &&
            i.url.toLowerCase().includes(this.search.toLowerCase())) ||
          (i.name != null &&
            i.name.toLowerCase().includes(this.search.toLowerCase())) ||
          (i.description != null &&
            i.description.toLowerCase().includes(this.search.toLowerCase()))
        );
      });
    },
  },
  created() {
    const that = this;

    document.addEventListener("keyup", (evt) => {
      if (evt.keyCode === 27) {
        that.close(true);
      }
    });

    document.addEventListener("keyup", (evt) => {
      if (evt.keyCode === 13 && that.dialog) {
        that.save();
      }
    });
    if (
      localStorage.getItem("faveItems") !== null &&
      localStorage.getItem("faveItems") !== "undefined" &&
      localStorage.getItem("faveItems") !== ""
    ) {
      this.items = JSON.parse(localStorage.getItem("faveItems"));
    }
  },
});
