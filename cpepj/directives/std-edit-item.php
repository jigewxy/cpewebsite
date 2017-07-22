<?php  include_once '../../config/GlobalConstants.php'; ?>
<div class="modal fade" id="edit-item-modal">

	<div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-info">
        	<button type="button" class="close" data-dismiss="modal"><small>Cancel</small>&times;</button>
            <h4 class="modal-title">Modify Project Details - <span>{{projectname}}</span></h4>
        </div>
		<div class="modal-body">
			<div class="panel">
				<div class="panel-body">
					<form id="form-edit-item" ng-submit="editItemSubmit()">
   						 	<div class="col-md-6">
	 							<table  class= "table table-condensed summary-table">
									<tr><td  width="30%"> Project Name </td><td><input class="form-control"  name="skus" type="text" value ="{{projectdata.project_name}}"></td></tr>
									<tr><td> SKUs </td><td><input class="form-control"  name="skus" type="text" value ="{{projectdata.skus}}"></td></tr>
									<tr><td> Tagname </td> <td><input class="form-control" name="tag" value ="{{projectdata.tag}}"></td></tr>
									<tr><td> Start Date </td> <td><input class="date-picker form-control" name="datestart" type="text" value ="{{projectdata.datestart}}"></td></tr>
									<tr><td> FC Date </td> <td><input class="date-picker form-control" name="datefc" type="text" value ="{{projectdata.datefc}}"></td></tr>
									<tr><td> RC Date </td> <td><input class="date-picker form-control" name="daterc" type="text" value ="{{projectdata.daterc}}"></td></tr>
									<tr><td> VR Date </td> <td><input class="date-picker form-control" name="datevr" type="text" value ="{{projectdata.datevr}}"></td></tr>
									<tr><td> Program Manager </td> <td><input class="form-control" name="pm"type="text" value ="{{projectdata.pm}}"></td></tr>
									<tr><td> Firmware Integrator </td><td><input class="form-control" name="fw"type="text" value ="{{projectdata.fw}}"></td></tr>
									<tr><td> SQ Lead </td> <td><input class="form-control" type="text" name="sq" value ="{{projectdata.sq}}"></td></tr>
									<tr><td> Unique Firmware </td> <td><input class="form-control" type="text" name="uniquefw" value ="{{projectdata.uniquefw}}"></td></tr>
									<tr><td> Branch </td> <td><input class="form-control" type="text" name="branch" value ="{{projectdata.branch}}"></td></tr>
									<tr><td> Project Category </td> <td><select class="form-control status-select" name="cat"> 
										<option>Major roll</option>
										<option>Minor roll</option>
										</select></td></tr>
									<input type="hidden" class="form-control" name="project_name" value="{{projectname}}">
									<input type="hidden" class="form-control" name="project_id" value="{{projectdata.id}}">
	 							</table>
	 					 	</div>
						<div class="col-md-6">
							 <h5>Project Notes: </h5>
    						 <textarea rows="25" class="form-control" name="tooltip">{{projectdata.tooltip}}</textarea>
    							<!--placeholder for the tooltip -->
    					</div>


						<table id= "item-table" class="table table-bordered table-condensed">
							<tr class="tr-item-table"><th>#</th><th class="th-crid">CRID</th><th>Type</th><th class="th-summary">Summary</th><th>Requestor</th><th>Fix Provider</th>
							<th class="th-sq">Test Partner</th><th>Affected SKUs</th><th class="th-sha">SHA</th><th>Component</th><th>Status</th></tr>
							<tr ng-repeat="x in projectitems">
								<td width="3%">{{$index+1}}</td>
								<td><input class="form-control input-sm" name="crid[]" type="text" value ="{{x.crid}}"></td>
								<td class="sel-box-col">
									<select class="form-control type-modify-box" name="type[]" ng-value="x.type"> 
										<option>Defect Fix</option>
										<option>New Feature</option>
									</select>
								</td>
								<td><input class="form-control input-sm input-expand-more"  name="summary[]" type="text" value ="{{x.summary}}"></td>
								<td><input class="form-control input-sm" name="requestor[]" type="text" value ="{{x.requestor}}"></td>
								<td><input class="form-control input-sm" name="fixer[]" type="text" value ="{{x.fixer}}"></td>
								<td><input class="form-control input-sm" name="testteam[]" type="text" value ="{{x.testteam}}"></td>
								<td><input class="form-control input-sm" name="products[]" type="text" value ="{{x.products}}"></td>
								<td><input class="form-control input-sm" name="sha[]" type="text" value ="{{x.sha}}"></td>
								<td class="sel-box-col">
									<select class="form-control component-modify-box" name="component[]" ng-value="x.component"> 
                                        <?php  foreach(ITEMCOMPONENT as $value) { echo "<option>{$value}</option>";}?>
									</select></td>
								<td class="sel-box-col">
									<select class="form-control status-modify-box" name="status[]" ng-value="x.status"> 
	                                     <?php  foreach(ITEMSTATUS as $value) { echo "<option>{$value}</option>";}?> 
									</select>
								</td>
								<input class="form-control input-sm" name="id[]" type="hidden" value ="{{x.id}}">
								
							</tr>
						</table>
						<input class="btn btn-primary btn-in-modal" type="submit" value="SAVE" >
					</form>
				    <br>
					<div id="edit-item-status"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal-footer"></div>
	</div>
</div>
<!-- Modify item modal ends -->