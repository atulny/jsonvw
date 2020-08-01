

   function setup(cx){
   $.getScript( "https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.js", function( data, textStatus, jqxhr ) {

  console.log( "Load was performed." );
});
/*
height: "70%",
        width: "100%",
        filtering: true,
        editing: true,
        inserting: true,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 15,
        pageButtonCount: 5,
        pageButtonCount: 5,
        pagerContainer: "#externalPager",
        pagerFormat: "current page: {pageIndex} &nbsp;&nbsp; {first} {prev} {pages} {next} {last} &nbsp;&nbsp; total pages: {pageCount}",
        pagePrevText: "<",
        pageNextText: ">",
        pageFirstText: "<<",
        pageLastText: ">>",
        pageNavigatorNextText: "&#8230;",
        pageNavigatorPrevText: "&#8230;",
        headerRowRenderer:null,
        filterRowRenderer:null,
rowClass:'',
    rowClick
        controller: db,
        controller: {
            loadData: function(filter) {
                var startIndex = (filter.pageIndex - 1) * filter.pageSize;
                return {
                    data: db.clients.slice(startIndex, startIndex + filter.pageSize),
                    itemsCount: db.clients.length
                };
            }
        },
                rowRenderer: function(item) {
            var user = item;
            var $photo = $("<div>").addClass("client-photo").append($("<img>").attr("src", user.picture.large));
            var $info = $("<div>").addClass("client-info")
                .append($("<p>").append($("<strong>").text(user.name.first.capitalize() + " " + user.name.last.capitalize())))
                .append($("<p>").text("Location: " + user.location.city.capitalize() + ", " + user.location.street))
                .append($("<p>").text("Email: " + user.email))
                .append($("<p>").text("Phone: " + user.phone))
                .append($("<p>").text("Cell: " + user.cell));

            return $("<tr>").append($("<td>").append($photo).append($info));
        },
                    { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
        */
        $("#jsGrid").jsGrid({
            height: "70%",
            width: "100%",
            editing: true,
            autoload: true,
            paging: true,
            deleteConfirm: function(item) {
                return "The client \"" + item.Name + "\" will be removed. Are you sure?";
            },
            rowClick: function(args) {
                showDetailsDialog("Edit", args.item);
            },
            controller: db,
            fields: [
                { name: "Name", type: "text", width: 150 },
                { name: "Age", type: "number", width: 50 },
                { name: "Address", type: "text", width: 200 },
                { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
                { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
                {
                    type: "control",
                    modeSwitchButton: false,
                    editButton: false,
                    headerTemplate: function() {
                        return $("<button>").attr("type", "button").text("Add")
                                .on("click", function () {
                                    showDetailsDialog("Add", {});
                                });
                    }
                }
            ]
        });

        $("#detailsDialog").dialog({
            autoOpen: false,
            width: 400,
            close: function() {
                $("#detailsForm").validate().resetForm();
                $("#detailsForm").find(".error").removeClass("error");
            }
        });

        $("#detailsForm").validate({
            rules: {
                name: "required",
                age: { required: true, range: [18, 150] },
                address: { required: true, minlength: 10 },
                country: "required"
            },
            messages: {
                name: "Please enter name",
                age: "Please enter valid age",
                address: "Please enter address (more than 10 chars)",
                country: "Please select country"
            },
            submitHandler: function() {
                formSubmitHandler();
            }
        });

        var formSubmitHandler = $.noop;

        var showDetailsDialog = function(dialogType, client) {
            $("#name").val(client.Name);
            $("#age").val(client.Age);
            $("#address").val(client.Address);
            $("#country").val(client.Country);
            $("#married").prop("checked", client.Married);

            formSubmitHandler = function() {
                saveClient(client, dialogType === "Add");
            };

            $("#detailsDialog").dialog("option", "title", dialogType + " Client")
                    .dialog("open");
        };

        var saveClient = function(client, isNew) {
            $.extend(client, {
                Name: $("#name").val(),
                Age: parseInt($("#age").val(), 10),
                Address: $("#address").val(),
                Country: parseInt($("#country").val(), 10),
                Married: $("#married").is(":checked")
            });

            $("#jsGrid").jsGrid(isNew ? "insertItem" : "updateItem", client);

            $("#detailsDialog").dialog("close");
        };

    });