<?php  include_once '../../config/GlobalConstants.php'; ?>
<!-- Edit item modal is defined, can't use "draggable" here, it will break the cursor behavior in input field -->
<div class="modal fade" id="edit-item-modal">

<div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><small>Cancel</small>&times;</button>
            <h4 class="modal-title">Modify Project Details - <span>{{projectdata.project_name}}</span></h4>
        </div>
<div class="modal-body">
<div class="panel">
<div class="panel-body">
    <form id="form-edit-item" ng-submit="editItemObj.submit()">
          <div class="col-md-6">
                <table class= "table table-condensed summary-table"> 
                    <tr><td style="width:30%"> Category: </td> <td>
                        <select class="form-control status-select" name="cat" value ="{{projectdata.cat}}"> 
                            <option>Major roll</option>
                            <option>Minor roll</option>
                            </select></td></tr>	 
                    <tr><td> FW Version:</td> <td><input class="form-control" name="revision" type="text" value ="{{projectdata.revision}}"></td></tr>
                    <tr><td> Affected SKUs: </td> <td><input class="form-control" name="skus" type="text" value ="{{projectdata.skus}}"></td></tr>
                    <tr><td> Unique Firmware: </td> <td><input class="form-control" name="uniquefw" type="text" value ="{{projectdata.uniquefw}}"></td></tr>
                    <tr><td> R.O.I: </td> <td><input class="form-control" name="roi" type="text" value ="{{projectdata.roi}}"></td></tr>
                    <tr><td> VR Date: </td> <td><input class="date-picker form-control" name="datevr" type="text" value ="{{projectdata.datevr}}" required></td></tr>
                    <tr><td> Cloud Publish Date:</td><td><input class="date-picker form-control date-publish" name="datelive" type="text" value ="{{projectdata.datelive}}"></td></tr>
                    <tr><td> FDU Publish Date:</td><td><input class="date-picker form-control date-publish" name="datefdu" type="text" value ="{{projectdata.datefdu}}"></td></tr>
                    <tr><td> MFG Roll-in Date:</td><td><input class="date-picker form-control date-publish" name="datemfg" type="text" value ="{{projectdata.datemfg}}"></td></tr>
                    <tr><td> Program Manager: </td> <td><input class="form-control" name="pm"type="text" value ="{{projectdata.pm}}"></td></tr>
                    <tr><td> Firmware Integrator:</td><td><input class="form-control" name="fw"type="text" value ="{{projectdata.fw}}"></td></tr>						 	 
                    <tr><td> SQ Lead:</td> <td><input class="form-control" type="text" name="sq" value ="{{projectdata.sq}}"></td></tr>							 
                    <tr><td> Built on SHA:</td> <td><input class="form-control" type="text" name="scmkey" value ="{{projectdata.sha}}"></td></tr>
                    <tr><td> Signature:</td> <td><input class="form-control" type="text" name="signature" value ="{{projectdata.signature}}"></td></tr>
                    <tr><td> Branch:</td> <td><input class="form-control" type="text" name="branch" value ="{{projectdata.branch}}"></td></tr>
                    <tr><td> Firmware Link:</td> <td><input class="form-control" type="text" name="fwlink" value ="{{projectdata.fwlink}}"></td></tr>
                    <input type="hidden" class="form-control" name="project_id" value="{{projectdata.id}}">
                </table>
            </div>
            <div class="col-md-6">
                <h5>Project Notes: </h5>
              <textarea rows="30" class="form-control" name="tooltip">{{projectdata.tooltip}}</textarea>
                  <!--placeholder for the tooltip -->
            </div>

        <table id="item-table" class="table table-bordered table-condensed">
              <tr class="tr-item-table"><th>#</th><th class="th-crid">CRID</th><th>Type</th><th class="th-summary">Summary</th><th>Requestor</th><th>Fix Provider</th>
                    <th class="th-sq">Test Partner</th><th>Affected SKUs</th><th class="th-sha">SHA</th><th>Component</th></tr>
              <tr ng-repeat="x in itemlist">
                <td>{{$index+1}}</td>
                <td><input class="form-control input-sm" name="crid[]" type="text" value ="{{x.crid}}"></td>
                <td class="sel-box-col"><select class="form-control type-modify-box" name="type[]" ng-value="x.type"> 
                    <option>Defect Fix</option>
                    <option>New Feature</option>
                  </select></td>
                <td><input class="form-control input-sm input-expand-more"  name="summary[]" type="text" value ="{{x.summary}}"></td>
                <td><input class="form-control input-sm" name="requestor[]" type="text" value ="{{x.requestor}}"></td>
                <td><input class="form-control input-sm" name="fixer[]" type="text" value ="{{x.fixer}}"></td>
                <td><input class="form-control input-sm" name="testteam[]" type="text" value ="{{x.testteam}}"></td>
                <td><input class="form-control input-sm" name="products[]" type="text" value ="{{x.products}}"></td>
                <td><input class="form-control input-sm" name="sha[]" type="text" value ="{{x.sha}}">
                 <input name="id[]" type="hidden" value ="{{x.id}}"></td>
                <td class="sel-box-col"><select class="form-control component-modify-box" name="component[]" ng-value="x.component"> 
                   <?php  foreach(ITEMCOMPONENT as $value) { echo "<option>{$value}</option>";}?>
                    </select></td>
              </tr>
          </table>

          <br><br>
          <input class="btn btn-primary btn-in-modal" type="submit" value="SAVE" >
         </form>
         <div id="edit-item-status"></div>
        </div>
      </div>
    </div>
  </div>
<div class="modal-footer"> 
</div>
</div>
</div>