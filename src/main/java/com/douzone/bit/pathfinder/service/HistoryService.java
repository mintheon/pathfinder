package com.douzone.bit.pathfinder.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.douzone.bit.pathfinder.model.entity.mongodb.HistoryTb;
import com.douzone.bit.pathfinder.model.entity.mongodb.RoutesTb;
import com.douzone.bit.pathfinder.model.network.Header;
import com.douzone.bit.pathfinder.model.network.response.HistoryResponse;
import com.douzone.bit.pathfinder.model.network.response.HistoryRoutesResponse;
import com.douzone.bit.pathfinder.repository.mongodb.HistoryRepository;
import com.douzone.bit.pathfinder.repository.mongodb.RoutesRepository;

@Service
@Transactional
public class HistoryService {

	@Autowired
	private HistoryRepository historyRepository;
	
	@Autowired
	private RoutesRepository routesRepository;
	
	public Header<List<HistoryResponse>> readHistory() {
		
		List<HistoryTb> historys = historyRepository.findAll();
		
		List<HistoryResponse> historyList = historys.stream().map(history -> historyResponse(history))
				.collect(Collectors.toList());
		
		return Header.OK(historyList);
	}
	
	public Header<HistoryRoutesResponse> readRoutes(ObjectId id) {
		
		RoutesTb routesTb = routesRepository.findById(id);
		
		HistoryRoutesResponse routes = routesResponse(routesTb);
		
		return Header.OK(routes);
	}
	
	private HistoryResponse historyResponse(HistoryTb history) {
		
		HistoryResponse response = HistoryResponse.builder()
				._id(history.get_id()).regdate(history.getRegdate())
				.username(history.getUsername()).carname(history.getCarname())
				.dep(history.getDep()).arvl(history.getArvl())
				.dist(history.getDist()).fee(history.getFee())
				.dlvrdate(history.getDlvrdate()).arrivedate(history.getArrivedate())
				.routes(history.getRoutes())
				.build();
		
		return response;
	}
	
	private HistoryRoutesResponse routesResponse(RoutesTb routes) {
		
		HistoryRoutesResponse response = HistoryRoutesResponse.builder()
				.index(routes.getIndex()).detail(routes.getDetail())
				.build();
		
		return response;
	}
}