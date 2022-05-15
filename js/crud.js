//Conexion base de datos
var db = openDatabase("productosDB","1.0","Base de datos de productos",2*1024*124);
// crear tabla
//var t_producto = "CREATE TABLE  producto(id real uniqute,nombre text, valor number)";
var t_producto = "CREATE TABLE  productos(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR (100) NOT NULL,valor DECIMAL(6,2) NOT NULL)";
// creamos la query de inseercion
var t_producto_insert ="insert into productos(id,nombre,valor)values (?,?,?)";
//queryde consulta
var t_producto_consult ="SELECT * FROM productos ORDER BY id DESC";
var t_producto_delete ="Drop table productos";

var idModificar;
var modificando=false;
function limpiar() {
    document.getElementById("producto").value = "";
    document.getElementById("valor").value = "";
  };

function modificarProducto(r){
    idModificar=r.id[(r.id.length-1)];
    db.transaction(function (tx){
        var sql = t_producto_consult;
        tx.executeSql(sql,undefined,function(tx,result){
            if (result.rows.length) {
                for (let index = 0; index < result.rows.length; index++) {
                    var row=result.rows.item(index);
                    if(idModificar==row.id){
                        console.log(row.nombre);
                        console.log(row.valor);
                        document.getElementById("producto").value =(row.nombre);
                        document.getElementById("valor").value= (row.valor);
                    }
                    
                }
            }
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
    });
    modificando=true;
}
function  eliminarProducto(r){
    //var i=r.parentNode.parentNode.rowIndex;
    //document.getElementById("customers").deleteRow(i);
    //console.log(i);
    var i=r.id[(r.id.length-1)];
    db.transaction(function (tx) {
        var sql = "DELETE FROM productos WHERE id="+i+";";
        tx.executeSql(sql,[],function() {},function (tx, result) {
            console.log(result);
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
        
    });
    cargarDatos()
    
};


function cargarDatos(){
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM productos order by id desc",undefined,function(tx, result){
                    if (result.rows.length) {
                        document.getElementById("filas").innerHTML="";
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            var item = row.nombre;
                            var id = row.id;
                            var precio = row.valor;
                            var fila ='<tr id="fila' + id +'"><td><span>A' + id +'</span></td><td><span>' + item +'</span></td><td><span>' + precio +' COP$</span></td><td><button id="modificar'+id+'" onclick="modificarProducto(this)"><img src="img/modificar.png"/></button></td><td><button id="eliminar'+id+'" onclick="eliminarProducto(this)"><img src="img/eliminar.png"/></button></td></tr>';
                            var btn= document.createElement("TR");
                            btn.innerHTML=fila;
                            document.getElementById("filas").appendChild(btn);
                        }
                    }else {
                        document.getElementById("filas").innerHTML="No existen registros";       
                    }
                },
                function (tx, err) {
                    alert(err.message);
                });
            });
            //var filaTotal=document.getElementById("listaProductos").rows.length;
            //var filaTotal= document.getElementById('filas');
            //var fi= document.getElementsByTagName("tr").length;
            //var ff= fi.length;
            //console.log(fi);
};

function borrarTabla(){
    db.transaction(function (tx) {
        var sql = "DROP TABLE productos";
        tx.executeSql(sql,[],function() {},function (tx, err) {
            alert(err.message);
        });
        tx.executeSql(t_producto,[],function() {},function (tx, err) {
            alert(err.message);
        });
    });
    cargarDatos()
}

//*/
function agregar(){
    var item = document.getElementById("producto").value;
    var precio = document.getElementById("valor").value;
    if(modificando==false){
        db.transaction(function (tx) {
            var sql = "INSERT INTO productos(nombre,valor) VALUES(?,?)";
            tx.executeSql(sql,[item, precio],function() {},function (tx, err) {
                alert(err.message);
            });
        });
    }else{
        modificando=false;
        db.transaction(function (tx) {
            var sql="UPDATE productos SET nombre='"+ item +"',valor='"+ precio +"'WHERE id="+ idModificar +";";
            tx.executeSql(sql,undefined,function() {
                console.log("modificado correctamente");
            },function(tx,error){
                console.log("Hubo un error: " + error.message);
            });

        });
    }
    limpiar();
    cargarDatos();
};

(function(){
    //creacion de tabla
    db.transaction(function(tx){
        tx.executeSql(t_producto,[],function (tx,result) {
            console.log("la tabla se creo con exito")
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
    });

    cargarDatos();

})();