package com.douzone.bit.pathfinder.model.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection="history")
public class HistoryTb {

	private Long index;
	private LocalDateTime regDate;
	private String userName;
	private String dep;
	private String arvl;
	private Double dist;
	private Long fee;
	private LocalDateTime dlvrDate;
	private List<ObjectId> routes;
}
