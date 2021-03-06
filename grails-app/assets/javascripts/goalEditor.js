$(document).ready(function(){
    $("#saveBtn").bind('click',savebtn);
    $(".statusDropdownElm").bind('change',showDateDrop);
    $("#addBtn").bind('click',createNewCard);
    $("#YearChangeFrm select").bind('change',function(){
        $("#YearChangeFrm").submit();
     });
     $(document).on('click', "button[remove_unsaved_goal_btn='t']" , null , function () {
         $(this).parent().parent().parent().parent().remove();
     });

    CKEDITOR.on('instanceReady', function(){
        $.each( CKEDITOR.instances, function(instance) {
            CKEDITOR.instances[instance].on("change", function(e) {
                for ( instance in CKEDITOR.instances )
                    CKEDITOR.instances[instance].updateElement();
            });
        });
    });

    $("#commentsModel button.btn-primary").on('click',function() {
        var commentText = $.trim($("#newComment").val());
        var data = $("#commentForm").serialize();

        $.post(window.fmBaseDir + 'saveComments',data ).then(function(res) {
            if(res.success) {
                $('#commentsModel').modal('hide');
            } else {
                alert(res.msg);
            }
        }).fail(function () {
            alert("Fail");
        });
        return true;
    });
});

$('#commentsModel').on('show.bs.modal', function (event) {
   // event.preventDefault();
    var button = $(event.relatedTarget) // Button that triggered the modal
    var goalId = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead
    var modal = $(this)
    modal.find('.modal-body #goalId').val(goalId);
    $("#prevComments").empty();
    $("#newComment").val('');
    $.get(window.fmBaseDir + '../employeeGoalComment?employeeGoal=' + goalId)
        .then(function(res) {
            var comment;
            for( comment in res) {
                $("#prevComments").append('<div>Created on ' + res[comment].createdDate + ' by ' + res[comment].modifiedUser.username + '</div>');
                $("#prevComments").append('<div class="border border-dark"> ' + res[comment].commentStr + '</div>');
            }
        }).fail(function () {
        alert("Fail");
    });
});

var createNewCard = function() {
    $.post(window.fmBaseDir + 'createCard',[] ).then(function(res) {
        var count = $('.card-body').length + 1;
        var div = $('<div class="card"><div class="card-header" role="tab" id="headingTwo'+count+'">\n' +
        '            <a class="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapseTwo'+count+'" aria-expanded="false" aria-controls="collapseTwo'+count+'">\n' +
        '                <h5 class="mb-0 '+ res.id + '">New Goal ' + count  +' <button remove_unsaved_goal_btn="t" class="btn btn-danger">Delete</button> </h5>\n' +
        '            </a>\n' +
        '        </div>' +
        '</div>');

        var ul = $('<ul style="list-style: none;"></ul>');
        var li = $("<li><div id='"+res.id+"_errorsDiv' class='fm-error-msg error-details ui-state-error' style='display: none;' error_field='true'></div></li>");
        $(ul).append(li);
        li = $("<li></li>");
        li.append('<label for="'+ res.id + '_orginTargetDate">Orginal Completed Date: </label><span id="'+ res.id + '_orginTargetDate"></span>');
        var divgrp1 = $('<div id="'+ res.id + '_targetDiv" style="float: right;display: inline-block;"></div>');

        divgrp1.append('<label for="'+ res.id + '_targetDate">Target Completed Date: </label>');
        divgrp1.append('<input type="hidden" name="'+ res.id + '_targetDate" value="date.struct"/>');
        $.each($('#goalId_targetDiv select'),function (idx,value) {
            item = $(value).clone(true,true);
            item.attr('name',  res.id + "_" + $(item).prop('name'));
            item.attr('id',  res.id + "_" + $(item).prop('id'));
            divgrp1.append(item);
        });

        var divgrp2 = $('<div id="'+ res.id + '_completeDiv" style="float: right;display: none;"></div>');
        divgrp2.append('<label>Completed Date: </label> ' + $.trim($("#goalId_completeDiv").text()));
        li.append(divgrp1);
        li.append(divgrp2);
        $(ul).append(li);

        li = $("<li></li>");
        var divgrp = $('<div class="form-group" class="align-top" style="clear:both;margin-top: 10px;"></div>');
        divgrp.append('<label for="'+ res.id + '_title">Goal Title: </label>');
        divgrp.append('<input type="text" class="form-check-inline" value="" style="width:300px;" maxlength="100" minlength="3" name="'+ res.id + '_title" required="required" aria-required="true"  aria-label="title" />');
        divgrp.append('<label for="'+ res.id + '_status">Goal Status: </label>');
        var item = $('#tmp_statusdrp').clone(true,true);
        item.attr('name',res.id + "_status");
        item.attr('id',res.id + "_status");
        divgrp.append(item);
        li.append(divgrp);
        divgrp.append('<label for="'+ res.id + '_types">KPO Type: </label>');
        item = $('#tmp_typesdrp').clone(true,true);
        item.attr('name',res.id + "_types");
        item.attr('id',res.id + "_types");
        divgrp.append(item);
        li.append(divgrp);
        $(ul).append(li);
        li = $("<li></li>");

        li.append('<label for="'+ res.id + '_descript">Goal Description: </label>');
        li.append('<textarea id="'+res.id+'_descript" name="'+res.id+'_descript" style="visibility: hidden; display: none;"></textarea>');
        li.append('<div id="'+ res.id + '_sdescript"></div>');
        li.append(' <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#commentsModel" data-whatever="'+res.id +'">Comments</button>');
        $(ul).append(li);

        var div1 = $('<div class="card-body"></div>').append(ul);
        var div2 = $('<div id="collapseTwo'+count+'" class="collapse" role="tabpanel" aria-labelledby="headingTwo'+count+'" data-parent="#accordionEx"></div>').append(div1);

        $(div).append(div2);
        $('#accordionEx').append(div);

        var instance = CKEDITOR.appendTo(res.id + '_sdescript',{ removeButtons:"Underline,JustifyCenter,Source,Flash,Image,Templates,Select,Iframe,HiddenField,TextField,Textarea,Checkbox,Button,ImageButton,Radio,Form"});

            CKEDITOR.on('instanceReady', function(){
                instance.updateElement();
            });

            instance.updateElement();
            instance.on(  'change', function (e) {
                e.editor.updateElement();
                $("#" + res.id + "_descript").val(e.editor.getData());
            });

            instance.on(  'blur', function (e) {
                e.editor.updateElement();
                $("#" + res.id + "_descript").val(e.editor.getData());
            });

        }).fail(function () {
        alert("Fail");
    });
};

var showDateDrop = function() {
    var value = $(this).val();
    var baseSel = $($(this).parent().parent().siblings().get(1)).find('div');
    if ( value == 'Completed' ||value ==  'Cancelled' ) {
        $(baseSel).first().css('display','none');
        $(baseSel).last().css('display','inline-block');
    } else {
        $(baseSel).last().css('display','none');
        $(baseSel).first().css('display','inline-block');
    }
};


var savebtn = function() {
    $("#main_error").css('display', 'none');
    $("#main_save_done").css('display', 'none');
    $.each($('div[error_field="true"]'),function(idx,value){
        $(value).css('display', 'none');
        $(value).html("");
    });

    var data = $("#gaolFrm").serialize();
    $.each($(".card-body ul"),function(idx,val) {
        data =data + "&ids=" +  $(val).children().eq(2).children().children('input').prop('name');
    });

    data = data + "&empId=" + $("#emp_id").val();
    // data.ids = ids;
    $.post(window.fmBaseDir + 'saveGoals',data )
        .then(function(res) {
            $.each(res.titles,function(idx,value){
                $("h5." + idx).html(value[0]);
                if(value[1]) {
                    $("#" + idx + "_orginTargetDate").html(value[1]);
                }
            });

            var errorcnt1= 0
            var errorcnt2 = 0
            $.each(res.errors, function(idx,value){
                errorcnt1 += value.length;
                errorcnt2++;
                $("#" + idx + "_errorsDiv").html(value.join("<br />"));
                $("#" + idx + "_errorsDiv").css('display', 'block');
            });
            if(errorcnt1 > 0 ) {
                $("#main_error").html("There is " + errorcnt1 + " error(s) in " + errorcnt2 + " different Goal(s)");
                $("#main_error").css('display', 'block');
            } else {
                $("#main_save_done").css('display', 'block');
            }
        }).fail(function () {
            alert("Fail");
        });
};