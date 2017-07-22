<?php  include_once '../config/GlobalConstants.php'; ?>
<div class="modal fade" id="add-item-modal">
  <div class="modal-dialog">
  <div class="modal-content">
  <div class="modal-header bg-success">
     <button type="button" class="close" data-dismiss="modal"><small>Cancel</small>&times;</button>
     <h4 class="modal-title">Add New Item</h4>
  </div>
  <div class="modal-body">
  <form id="form-add-item" ng-submit="$ctrl.addItemObj.submit()">
        <input type="hidden" name="project_id" value="{{$ctrl.pjid}}">
        <label class="control-label"><small>Request ID:</small></label>
        <input type="text" class="form-control input-sm" name="crid" required>
        <label class="control-label"><small>Type:</small></label>
        <select class="form-control type-select" name="type">
          <option>Defect Fix</option>
          <option>New Feature</option>
        </select>
        <label class="control-label"><small>Summary:</small></label>
        <textarea type="text" class="form-control input-sm" rows="3" name="summary"></textarea>
        <label class="control-label"><small>Developer:</small></label>
        <input type="text" class="form-control input-sm" name="fixer" required>
        <label class="control-label"><small>Affected SKUs:</small></label>
        <input type="text" class="form-control input-sm" name="skus" required>

        <label class="control-label"><small>Component:</small></label>
        <select class="form-control component-select" name="component">
        <?php  foreach(ITEMCOMPONENT as $value) { echo "<option>{$value}</option>";}?>
        </select>
        <label class="control-label"><small>Status:</small></label>
        <select class="form-control status-select" name="status">
        <?php  foreach(ITEMSTATUS as $value) { echo "<option>{$value}</option>";}?>
        </select>
        <br><br>
        <input class="btn btn-success btn-in-modal" type="submit" value="ADD" >
    </form>
        <div id="add-item-status"></div>
        </div>
      </div>
    </div>
  </div>

  