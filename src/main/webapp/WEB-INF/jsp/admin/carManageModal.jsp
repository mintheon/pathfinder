<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%-- Insert Modal --%>
<div class="modal fade" id="insertModal" tabindex="-1" role="dialog"
	aria-labelledby="insertModalTitle" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="title">차량 추가</h5>
			</div>

			<div class="modal-body">
				<form id="carCreateForm">

					<div class="form-group row">
						<label for="carArea" class="col-sm-3 col-form-label-sm">지역</label>
						<div class="col-sm-8">
							<select class="selectpicker" data-live-search="true"
								id="carArea" name="carArea">
							</select>
						</div>
					</div>


					<div class="form-group row">
						<label for="carNumber" class="col-sm-3 col-form-label-sm">차량번호</label>
						<div class="col-sm-8">
							<input type="text" class="form-control" id="carNumber"
								name="carNumber" />
						</div>
					</div>

					<div class="form-group row">
						<label for="carName" class="col-sm-3 col-form-label-sm">차종</label>
						<div class="col-sm-8">
							<input type="text" class="form-control" id="carName"
								name="carName" />
						</div>
					</div>

					<div class="form-group row">
						<label for="carFuel" class="col-sm-3 col-form-label-sm">연비</label>
						<div class="col-sm-8">
							<input type="Number" class="form-control" id="carFuel"
								name="carFuel" />
						</div>
					</div>

					<div class="form-group row">
						<label for="carBuy" class="col-sm-3 col-form-label-sm">구입날짜</label>
						<div class="col-sm-8">
							<input type="text" class="form-control" id="carBuy"
								name="carBuy" placeholder="날짜넣기" readonly />
						</div>
					</div>

					<div class="formCheck" id="serverFormCheck"></div>

					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal">취소</button>
						<button type="submit" class="btn btn-success" id="InsertBtn">등록</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>