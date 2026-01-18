package com.sterma.back.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@Builder
public class CommunityLeaderInfo {
    private String communityLeaderName;
    private String communityLeaderTelephone;
    private String communityLeaderNote;

    public CommunityLeaderInfo(){}
}
