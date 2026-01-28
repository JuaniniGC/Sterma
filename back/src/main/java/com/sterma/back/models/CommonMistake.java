package com.sterma.back.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "common_mistakes")
@Builder
@AllArgsConstructor
public class CommonMistake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String identificator;

    @Column(nullable = false)
    private String description;

    public CommonMistake() {
    }
}
