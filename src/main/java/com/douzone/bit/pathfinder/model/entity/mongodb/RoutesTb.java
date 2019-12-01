package com.douzone.bit.pathfinder.model.entity.mongodb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "routes")
public class RoutesTb {

	private ObjectId hindex;
	private Object[] detail;
}
