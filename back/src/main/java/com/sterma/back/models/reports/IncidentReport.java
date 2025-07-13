package com.sterma.back.models.reports;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "incident_report")
public class IncidentReport extends Report{
}
