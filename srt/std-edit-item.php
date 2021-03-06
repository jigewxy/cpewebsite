<!-- Modify item modal is defined, can't use "draggable" here, it will break the cursor behavior in input field -->
<?php  include_once '../config/GlobalConstants.php'; ?>

<div class="modal fade" id="edit-item-modal">
<div class="modal-dialog modal-lg">
<div class="modal-content">
<div class="modal-header bg-primary">
<button type="button" class="close" data-dismiss="modal"><small>Cancel</small>&times;</button>
<h4 class="modal-title"> Modify Project Details</h4>
</div>
<div class="modal-body">
<form id="form-edit-item" ng-submit="$ctrl.editItemObj.submit()">
	<div class="col-md-6">
	<table id="table-summary-edit" class= "table table-condensed">
	 <tr><td width="30%">Customer</td> <td><input class="form-control"  name="customer" type="text" value ="{{$ctrl.pjdata.customer}}"></td></tr>
	 <tr><td> Main Feature</td> <td><input class="form-control" name="feature" type="text" value ="{{$ctrl.pjdata.feature}}"></td></tr>
	 <tr><td> SKUs</td><td><input class="form-control" name="product" type="text" value ="{{$ctrl.pjdata.product}}"></td></tr>
	 <tr><td> Region</td><td><select class='srt-region-select region-edit-sel form-control' name='region' ng-value ="$ctrl.pjdata.region">
     <?php  foreach(PJREGION as $value) { echo "<option>{$value}</option>";}?>
               </select></td></tr>
	 <tr><td> Requestor </td> <td><input class="form-control" name="requestor" type="text" value ="{{$ctrl.pjdata.requestor}}"></td></tr>
	 <tr><td> Request Date </td> <td><input class="date-picker form-control" name="datestart" type="date" ng-value ="$ctrl.pjdata.datestart"></td></tr>
	 <tr><td> FC Date</td><td><input class="date-picker form-control" name="datefc" type="date" ng-value ="$ctrl.pjdata.datefc"></td></tr>
	 <tr><td> RC Date</td> <td><input class="date-picker form-control" name="daterc" type="date"  ng-value ="$ctrl.pjdata.daterc"></td></tr>
	 <tr><td> VR Date</td> <td><input class="date-picker form-control" name="datevr" type="date"  ng-value ="$ctrl.pjdata.datevr"></td></tr>
	 <tr><td> Revenue</td> <td><input class="form-control" type="text" name="revenue" value ="{{$ctrl.pjdata.revenue}}"></td></tr>
	 <tr><td> Developer</td> <td><input class="form-control" type="text" name="developer" value ="{{$ctrl.pjdata.developer}}"></td></tr>
     <tr><td> Test Lead</td> <td><input class="form-control" type="text" name="sq" value ="{{$ctrl.pjdata.sq}}"></td></tr>
	 <tr><td> Branch Info</td> <td><input class="form-control" type="text" name="branch" value ="{{$ctrl.pjdata.branch}}"></td></tr>
	 <tr><td> Firmware Link</td><td><input class="form-control" type="text" name="fwlink" value ="{{$ctrl.pjdata.fwlink}}"></td></tr>
	 <tr class="item-status-sel"><td>Current State</td><td><select class='srt-state-select state-edit-sel form-control' name='state' ng-value ="$ctrl.pjdata.state"> 
       <?php  foreach(PJSTATUS as $value) { echo "<option>{$value}</option>";}?>
               </select></td></tr>
	 <input type="hidden" class="form-control" name="project_id" value="{{$ctrl.pjdata.id}}">
	 </table>
	 </div class="col-md-6">
   <div class="col-md-6">
     <h5>Project Notes: </h5>
     <textarea rows="28" class="form-control" name="tooltip">{{$ctrl.pjdata.tooltip}}</textarea> 
    </div>
      <hr>
    <table id="table-item-edit" class="table table-condensed">
      <tr><td>Item</td><td>CRID</td><td>Type</td><td>Summary</td><td>Fix Provider</td><td>Affected SKUs</td><td>Component</td><td>Status</td></tr>
      <tr ng-repeat="x in $ctrl.itemlist">
	   <td>{{$index+1}}<input type="hidden" name ="id[]" value="{{x.id}}"></td>
	   <td><input class="form-control input-sm" name="crid[]" type="text" value ="{{x.crid}}"></td>
	   <td class="sel-box-col"><select class="form-control type-modify-box" name="type[]" ng-value="x.type"> 
      <option>Defect Fix</option>
      <option>New Feature</option>
      </select></td>
	  <td width="25%"><input class="form-control input-sm input-expand-more"  name="summary[]" type="text" value ="{{x.summary}}"></td>
	  <td><input class="form-control input-sm" name="fixer[]" type="text" value ="{{x.fixer}}"></td>
	  <td><input class="form-control input-sm" name="skus[]" type="text" value ="{{x.skus}}"></td>
      <td class="sel-box-col"><select class="form-control component-modify-box" name="component[]" ng-value="x.component"> 
       <?php  foreach(ITEMCOMPONENT as $value) { echo "<option>{$value}</option>";}?>
      </select></td>
	   <td class="item-status-sel sel-box-col"><select class="form-control status-modify-box" name="status[]" ng-value ="x.status"> 
       <?php  foreach(ITEMSTATUS as $value) { echo "<option>{$value}</option>";}?>
      </select></td></tr>
      </table>
<br><br>
<input class="btn btn-primary btn-in-modal" type="submit" value="SAVE" >

<!-- reusable directive stdModifyItemForm. for object, no need to use expression {{}} -->
</form>
<div id="edit-item-status"></div>
</div>
</div>
<div class="modal-footer"> 
</div>
</div>
</div>
<!-- Modify item modal ends -->