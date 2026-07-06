package com.example.demo.event;

import com.example.demo.entity.DocumentVersion;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class VersionSubmittedEvent extends ApplicationEvent {
    private final DocumentVersion version;

    public VersionSubmittedEvent(Object source, DocumentVersion version) {
        super(source);
        this.version = version;
    }
}