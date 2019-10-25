package com.douzone.bit.pathfinder.branch.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class BranchTb {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long branchIndex;
	private String branchName;
	private String branchOwner;
	private Integer branchValue;
	private String branchAddr;
	private String branchDaddr;
	private String branchPhone;
	private Double brachLat;
	private Double branchLng;
}