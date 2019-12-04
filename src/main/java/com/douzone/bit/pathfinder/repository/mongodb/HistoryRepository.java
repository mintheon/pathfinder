package com.douzone.bit.pathfinder.repository.mongodb;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.douzone.bit.pathfinder.model.entity.mongodb.HistoryTb;


import java.util.Date;
import java.util.List;

public interface HistoryRepository extends MongoRepository<HistoryTb, String> {

	Object findByRoutes(ObjectId routes);
	
	//검색 페이지
	public Page<HistoryTb> findByCarnameLike(String carname, Pageable pageable);
	
	public Page<HistoryTb> findByRegdate(String carname, Pageable pageable);
	
	public Page<HistoryTb> findByUsernameLike(String carname, Pageable pageable);
	
	public Page<HistoryTb> findByDep(String carname, Pageable pageable);

	public Page<HistoryTb> findByArvl(String carname, Pageable pageable);

	@Query("{'arrivedate' : { '$lt' : ?0 }}")
	Page<HistoryTb> findAllByPp(Pageable pageable, Date LocalTime);
	
	@Query("{$and :[ {arrivedate : {'$gte' : ?0} }, { 'dlvrdate' :{'$lte' : ?0 } } ] }")
	Page<HistoryTb> findAllByIng(Pageable pageable, Date LocalTime);
	
	@Query("{'dlvrdate' : { '$gt' : ?0 }}")
	Page<HistoryTb> findAllByWill(Pageable pageable, Date LocalTime);
	
	List<HistoryTb> findByDlvrdate(Date dlvrdate);
	
	List<HistoryTb> findByArrivedate(Date arrivedate);

}
