package com.sterma.back.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.models.reports.Report;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imagePublicId;

    @ManyToOne
    @JsonIgnore
    private IncidentReport incidentReport;
}
