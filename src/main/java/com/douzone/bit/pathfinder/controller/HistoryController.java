package com.douzone.bit.pathfinder.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.douzone.bit.pathfinder.model.network.Header;
import com.douzone.bit.pathfinder.model.network.response.HistoryResponse;
import com.douzone.bit.pathfinder.model.network.response.HistoryRoutesResponse;
import com.douzone.bit.pathfinder.service.HistoryService;

@RestController
@RequestMapping("/history")
public class HistoryController {

	@Autowired
	HistoryService historyService;
	
	@GetMapping({ "", "/" })
	public ModelAndView history(ModelAndView mv, HttpServletRequest request) {
		
		System.out.println(request.getParameter("pageName"));
		mv.setViewName("/history");
		return mv;
	}
	
	@GetMapping("/gethistory.do")
	public Header<List<HistoryResponse>> getHistory() {

		return historyService.readHistory();
	}
	
	@GetMapping("/getroutes.do")
	public Header<HistoryRoutesResponse> getRoutes(
			@RequestParam("routesIndex") ObjectId id) {
		
		return historyService.readRoutes(id);
	}
}