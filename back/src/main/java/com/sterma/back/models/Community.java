package com.sterma.back.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@Table(name = "community")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false, unique = true)
    private String CIF;

    @Embedded
    private Localization localization;

    @Embedded
    private CommunityLeaderInfo communityLeaderInfo;

    public Community() {
    }


}
