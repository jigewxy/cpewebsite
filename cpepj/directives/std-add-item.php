<?php  include_once '../../config/GlobalConstants.php'; ?>
<div class="modal fade" id="add-item-modal">
<div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-success">
          <button type="button" class="close" data-dismiss="modal"><small>Cancel</small>&times;</button>
          <h4 class="modal-title">Add New Item</h4>
        </div>
<div class="modal-body">
<form id="form-add-item" ng-submit="addItemSubmit()"> 
  <div ng-if="!activePj">
  <label class="control-label"><small>Project:</small></label>
  <input class="form-control" name="pjname" value="{{pjName}}" readonly>
  <input type="hidden" name="project_id" value="{{pjId}}">
  </div>
<label class="control-label"><small>CRID</small></label>
<input type="text" class="form-control input-sm" name="crid" required>
<label class="control-label"><small>Type</small></label>
<select class="form-control type-select" name="type">
<option>Defect Fix</option>
<option>New Feature</option>
</select>
<label class="control-label"><small>Summary</small></label>
<input type="text" class="form-control input-sm" name="summary" required>
<label class="control-label"><small>Requestor</small></label>
<input type="text" class="form-control input-sm" name="requestor" required>
<label class="control-label"><small>Fix Provider</small></label>
<input type="text" class="form-control input-sm" name="fixer" required>
<label class="control-label"><small>Qualification Team</small></label>
<input type="text" class="form-control input-sm" name="testteam" required>
<label class="control-label"><small>Affected Products</small></label>
<input type="text" class="form-control input-sm" name="products" required>
<label class="control-label"><small>SHA</small></label>
<input type="text" class="form-control input-sm" name="sha" placeholder="Put N/A if not applicable" required>
<label class="control-label"><small>component</small></label>
<select class="form-control component-select" name="component">
        <?php  foreach(ITEMCOMPONENT as $value) { echo "<option>{$value}</option>";}?>
</select>
<div ng-if ="activePj">
<label class="control-label"><small>Status</small></label>
<select class="form-control status-select" name="status">
        <?php  foreach(ITEMSTATUS as $value) { echo "<option>{$value}</option>";}?>
</select>
</div>
<br><br>
<input class="btn btn-in-modal btn-success" type="submit" value="ADD" >
<br><br>
</form>
<div id="add-item-status"></div>
</div>
<div class="modal-footer"> 
</div>
</div>

</div>
</div>