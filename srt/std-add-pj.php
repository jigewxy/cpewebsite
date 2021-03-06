<?php  include_once '../config/GlobalConstants.php'; ?>
<div id="add-pj-modal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><small>Cancel</small>&times;</button>
       <h4 class="modal-title text-primary"><center>Add New Project </center></h4>
      </div>
      <div class="modal-body">
      <form id="form-add-pj" ng-submit="$ctrl.addPjObj.submit()"> 
        <label class="control-label"><small>Customer:</small></label>
        <input type="text" class="form-control input-sm" name="customer" required>
        <label class="control-label"><small>Main Feature:</small></label>
        <textarea class="form-control input-sm" rows="3" name="feature" required></textarea>
        <label class="control-label"><small>Product:</small></label>
        <input type="text" class="form-control input-sm" name="product" required>
        <label class="control-label"><small>Revenue:</small></label>
        <input type="text" class="form-control input-sm" name="revenue" required>
        <label class="control-label"><small>Region:</small></label>
        <select class='srt-region-select form-control' name='region'>
          <?php  foreach(PJREGION as $value) { echo "<option>{$value}</option>";}?>
        </select>
        <label class="control-label"><small>Requestor:</small></label>
        <input type="text" class="form-control input-sm" name="requestor" required>
        <hr>
        <label class="control-label"><small>Request Date:</small></label>
        <input type="date" class="form-control date-picker input-sm" name="datestart" required>
        <label class="control-label"><small>FC Date:</small></label>
        <input type="date" class="form-control date-picker input-sm" name="datefc" required>
        <label class="control-label"><small>RC Date:</small></label>
        <input type="date" class="form-control date-picker input-sm" name="daterc" required>
        <label class="control-label"><small>VR Date:</small></label>
        <input type="date" class="form-control date-picker input-sm" name="datevr" required>
        <hr>
        <label class="control-label"><small>Developer:</small></label>
        <input type="text" class="form-control input-sm" name="developer" required>
        <label class="control-label"><small>Test Lead:</small></label>
        <input type="text" class="form-control input-sm" name="sq" required>
        <label class="control-label"><small>Branch:</small></label>
        <input type="text" class="form-control input-sm full-length" name="branch" required>
        <div ng-if="$ctrl.completed">
        <label class="control-label"><small>Firmware Link:</small></label>
        <textarea class="form-control input-sm" rows="2" name="fwlink" required></textarea>
        </div>
        <label class="control-label"><small>Current State:</small></label>
        <select class="form-control srt-state-select" name="state">
          <?php  foreach(PJSTATUS as $value) { echo "<option>{$value}</option>";}?>
        </select> 
        <br><br>
        <input class="btn btn-success btn-in-modal" type="submit" value="ADD">
        </form>
        <div id="add-pj-status"></div>
        </div>
    </div>
    </div>
    </div>