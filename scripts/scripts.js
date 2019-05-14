function closealert(){
    var alert = document.getElementById('itemalert');
    // alert.style.display = 'none';

};

function itemadded(){

    var itemalert = document.getElementById('itemalert');
    itemalert.style.display = 'inline-block';
};


function itemremove(){
    if (confirm('Remove quantity?')){
        var itemalert = document.getElementById('itemalert');
        itemalert.style.display = 'inline-block';
    }
}