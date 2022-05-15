//Conexion base de datos
var db = openDatabase("productosDB","1.0","Base de datos de productos",2*1024*124);
// crear tabla
//var t_producto = "CREATE TABLE  producto(id real uniqute,nombre text, valor number)";
var t_producto = "CREATE TABLE  productos(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR (100) NOT NULL,valor DECIMAL(5,2) NOT NULL)";
// creamos la query de inseercion
var t_producto_insert ="insert into productos(id,nombre,valor)values (?,?,?)";
//queryde consulta
var t_producto_consult ="SELECT * FROM productos ORDER BY id DESC";
var t_producto_delete ="Drop table productos";

function limpiar() {
    document.getElementById("producto").value = "j";
    document.getElementById("valor").value = "";
  };

function cargarDatos(){
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM productos ORDER BY id DESC",undefined,function(tx, result){
                    if (result.rows.length) {
                        document.getElementById("filas").innerHTML="";
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            var item = row.nombre;
                            var id = row.id;
                            var precio = row.valor;
                            var fila ='<tr id="fila' + id +'"><td><span>A' + id +'</span></td><td><span>' + item +'</span></td><td><span>' + precio +' COP$</span></td><td><button><img src="img/modificar.png"/></button></td><td><button><img src="img/eliminar.png"/></button></td></tr>';
                            var btn= document.createElement("TR");
                            btn.innerHTML=fila;
                            document.getElementById("filas").appendChild(btn);
                        }
                    } else {
                        document.getElementById("listaProdcutos").append('<tr><td colspan="5" align="center">No existen registros de productos </td></tr>');
                    }
                },
                function (tx, err) {
                    alert(err.message);
                });
            });
};
//*/
function agregar(){
    var item = document.getElementById("producto").value;
    var precio = document.getElementById("valor").value;
    db.transaction(function (tx) {
        var sql = "INSERT INTO productos(nombre,valor) VALUES(?,?)";
        tx.executeSql(sql,[item, precio],function() {},function (tx, err) {
            alert(err.message);
        });
    });
    limpiar();
    cargarDatos();
};

(function(){

    db.transaction(function(tx){
        tx.executeSql(t_producto,[],function (tx,result) {
            console.log("la tabla se creo con exito")
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
    }); 
    cargarDatos();
    
    /*
    
    db.transaction(function(tx){
        tx.executeSql(t_producto_delete,[],function (tx,result) {
            console.log("la tabla se elimino con exito")
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
    }); 
    */
    


    /*
    function cargarDato(){
            tx.executeSql(t_producto_consult, [], function (tx, results) {
                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                  alert(results.rows.item(i).text);
                }
              });
        };
        
     FUNCION PARA LISTAR Y PINTAR TABLA DE PRODUCTOS DE PAGINA WED
    function cargarDatos() {
        $("#listaProductos").children().remove();
            db.transaction(function (trasaction) {
                var sql = "SELECT * FROM productos ORDER BY id DESC";
                trasaction.executeSql(sql,undefined,function (trasaction, result) {
                    if (result.rows.length) {
                        $("#listaProductos").append("<tr><th>Id</th><th>Producto</th><th>Valor</th><th><th></th></th</tr>");
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            var item = row.item;
                            var id = row.id;
                            var precio = row.precio;
                            $("#listaProductos").append(
                            '<tr id="fila' + id +'"class="Reg_A' + id +'"><td><span class="mid">A' + id +'</span></td><td><span>' + item +'</span></td><td><span>' + precio +' COP$</span></td><td><button class="btn btn-success"><img src=""/></button class="btn btn-danger"></td><td><button><img src=""/></button></td></tr>');
                        }
                    } else {
                        $("#listaProductos").append('<tr><td colspan="5" align="center">No existen registros de productos </td></tr>');
                    }
                },
                function (trasaction, err) {
                    alert(err.message);
                });
            });
    }
    // INSERTAR REGISTRO
    
    */

})();