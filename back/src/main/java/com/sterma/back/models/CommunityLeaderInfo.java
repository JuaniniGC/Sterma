package com.sterma.back.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
public class CommunityLeaderInfo {
    private String communityLeaderName;
    private Integer communityLeaderTelephone;
    private String communityLeaderNote;
}
