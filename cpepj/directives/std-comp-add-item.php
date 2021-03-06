<?php  include_once '../../config/GlobalConstants.php'; ?>
<div class="modal fade" id="add-item-modal">
  <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <button type="button" class="close" data-dismiss="modal"><small>Cancel</small>&times;</button>
            <h4 class="modal-title">Add New Item</h4>
          </div>
  <div class="modal-body">
    <form id="form-add-item" ng-submit="addItemObj.submit()"> 
      <div class="form-group">
        <label class="control-label"><small>Project:</small></label>
        <input class="form-control" name="pjname" value="{{addItemObj.pj.name}}" readonly>
        <input type="hidden" name="project_id" value="{{addItemObj.pj.id}}">
        <label class="control-label"><small>CRID:</small></label>
        <input type="text" class="form-control input-sm" name="crid" required>
        <label class="control-label"><small>Type:</small></label>
        <select class="form-control type-select" name="type">
        <option>Defect Fix</option>
        <option>New Feature</option>
        </select>
        <label class="control-label"><small>Summary:</small></label>
        <input type="text" class="form-control input-sm" name="summary" required>
        <label class="control-label"><small>Requestor:</small></label>
        <input type="text" class="form-control input-sm" name="requestor" required>
        <label class="control-label"><small>Fix Provider:</small></label>
        <input type="text" class="form-control input-sm" name="fixer" required>
        <label class="control-label"><small>Test Partner:</small></label>
        <input type="text" class="form-control input-sm" name="testteam" required>
        <label class="control-label"><small>Affected SKUs:</small></label>
        <input type="text" class="form-control input-sm" name="products" required>
        <label class="control-label"><small>SHA</small></label>
        <input type="text" class="form-control input-sm" name="sha">
        <label class="control-label"><small>component</small></label>
        <select class="form-control component-select" name="component">
          <?php  foreach(ITEMCOMPONENT as $value) { echo "<option>{$value}</option>";}?>
        </select>
        <br><br>
        <input class="btn btn-success btn-in-modal" type="submit" value="ADD" >
      </div>
    </form>
    <div id="add-item-comp-status"></div>

  </div>
</div>

</div>
</div>