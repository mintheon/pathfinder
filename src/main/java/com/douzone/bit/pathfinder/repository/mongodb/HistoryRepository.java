package com.douzone.bit.pathfinder.repository.mongodb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.douzone.bit.pathfinder.model.entity.mongodb.HistoryTb;

public interface HistoryRepository extends MongoRepository<HistoryTb, String> {

	Object findByRoutes(ObjectId routes);
}