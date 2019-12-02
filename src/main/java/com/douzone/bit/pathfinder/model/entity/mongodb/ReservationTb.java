package com.douzone.bit.pathfinder.model.entity.mongodb;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "reservation")
public class ReservationTb {
	private String index;
	private Object[] reservations;
}