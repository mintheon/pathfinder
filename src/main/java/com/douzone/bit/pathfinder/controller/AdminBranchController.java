package com.douzone.bit.pathfinder.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.douzone.bit.pathfinder.model.entity.BranchTb;
import com.douzone.bit.pathfinder.model.network.Header;
import com.douzone.bit.pathfinder.model.network.request.AdminBranchRequest;
import com.douzone.bit.pathfinder.model.network.response.AdminBranchResponse;
import com.douzone.bit.pathfinder.model.network.response.TreeResponse;
import com.douzone.bit.pathfinder.service.AdminBranchService;
import com.douzone.bit.pathfinder.service.AdminUserService;
import com.douzone.bit.pathfinder.service.TreeService;

@RestController
@RequestMapping("/admin/branchmanage")
public class AdminBranchController {

	@Autowired
	AdminBranchService adminBranchService;

	@Autowired
	AdminUserService adminUserService;

	@Autowired
	TreeService treeService;
	
	// branch create
	@PostMapping("")
	public Header<AdminBranchResponse> branchCreate(@RequestBody AdminBranchRequest request) {

		System.out.println(request);

		return adminBranchService.create(request);
	}

	// branch read
	@GetMapping("/read/{branchIndex}")
	public Optional<BranchTb> read(@PathVariable Long branchIndex) {
		System.out.println(adminBranchService.read(branchIndex));
		return adminBranchService.read(branchIndex);
	}

	// branch view
	@GetMapping("")
	public ModelAndView branchManage() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("/admin/branchManage");

		return mv;
	}

	// branch search
	@GetMapping("/search")
	public Header<List<AdminBranchResponse>> branchSearch(
			@RequestParam(required = false, defaultValue = "branchName") String searchType,
			@RequestParam(required = false) String keyword,
			@PageableDefault(sort = "branchIndex", direction = Sort.Direction.DESC) Pageable pageable) {

		return adminBranchService.search(pageable, searchType, keyword);
	}

	// 트리 불러오기
	@GetMapping("/treelist.do")
	public Header<TreeResponse> treeList() {
		return adminBranchService.readCompany();
	}

	// branch data
	@GetMapping("/branchlist.do")
	public Header<List<AdminBranchResponse>> branchList(
			@PageableDefault(sort = "branchIndex", direction = Sort.Direction.DESC, size = 10) Pageable pageable) {
		return adminBranchService.listpage(pageable);
	}

	// branch update
	@PutMapping("/update")
	public Header<AdminBranchResponse> branchUpdate(@RequestBody AdminBranchRequest request) {
		System.out.println(adminBranchService.update(request));
		return adminBranchService.update(request);
	}

	// branch delete
	@DeleteMapping("/delete/{branchIndex}")
	public Header branchDelete(@PathVariable Long branchIndex) {
		return adminBranchService.delete(branchIndex);
	}
}