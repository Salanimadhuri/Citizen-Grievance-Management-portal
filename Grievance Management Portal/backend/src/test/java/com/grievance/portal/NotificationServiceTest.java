package com.grievance.portal;

import com.grievance.portal.model.Notification;
import com.grievance.portal.repository.NotificationRepository;
import com.grievance.portal.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock NotificationRepository notificationRepository;
    @Mock SimpMessagingTemplate  messagingTemplate;
    @InjectMocks NotificationService notificationService;

    @Test
    void create_persistsAndPushesViaWebSocket() {
        Notification saved = new Notification();
        saved.setId("n-1");
        saved.setUserId("user-1");
        saved.setTitle("Test");
        saved.setMessage("Message");

        when(notificationRepository.save(any())).thenReturn(saved);

        var result = notificationService.create("user-1", "Test", "Message", "info", "c-1");

        assertThat(result.getId()).isEqualTo("n-1");
        verify(messagingTemplate).convertAndSendToUser(eq("user-1"), eq("/queue/notifications"), eq(saved));
    }

    @Test
    void markAllRead_updatesAllUnreadNotifications() {
        var n1 = new Notification(); n1.setRead(false); n1.setUserId("user-1");
        var n2 = new Notification(); n2.setRead(false); n2.setUserId("user-1");

        when(notificationRepository.findByUserIdAndReadFalse("user-1")).thenReturn(List.of(n1, n2));
        notificationService.markAllRead("user-1");

        assertThat(n1.isRead()).isTrue();
        assertThat(n2.isRead()).isTrue();
        verify(notificationRepository).saveAll(List.of(n1, n2));
    }

    @Test
    void markRead_setsReadTrue() {
        var n = new Notification(); n.setId("n-1"); n.setRead(false);
        when(notificationRepository.findById("n-1")).thenReturn(Optional.of(n));

        notificationService.markRead("n-1");

        assertThat(n.isRead()).isTrue();
        verify(notificationRepository).save(n);
    }

    @Test
    void getUnreadCount_returnsRepositoryCount() {
        when(notificationRepository.countByUserIdAndReadFalse("user-1")).thenReturn(5L);
        assertThat(notificationService.getUnreadCount("user-1")).isEqualTo(5L);
    }
}
