import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import NotificationList from "../../components/candidate/NotificationList";
import Pagination from "../../components/shared/Pagination";
import ErrorState from "../../components/shared/ErrorState";
import { CheckCheck } from "lucide-react";
import notificationApi from "../../api/notification.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";

export default function Notifications() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS[0], { page, limit: 10 }],
    queryFn: () => notificationApi.getNotifications({ page, limit: 10 }),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UNREAD_COUNT });
  };

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => invalidate(),
  });

  const markReadMutation = useMutation({
    mutationFn: (notificationId) => notificationApi.markAsRead(notificationId),
    onSuccess: () => invalidate(),
  });

  const notifications = data?.notifications ?? [];
  const pagination = data?.pagination ?? {};
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <RecruiterLayout title="Notifications">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Alerts</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={unreadCount === 0 || markAllMutation.isPending}
            className="text-xs text-[#06B6D4] hover:underline flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all as read
          </button>
        </div>

        {isError && (
          <div className="mb-4">
            <ErrorState
              title="Could not load notifications"
              message={error?.message}
              onRetry={refetch}
            />
          </div>
        )}

        <NotificationList
          notifications={notifications}
          loading={isLoading}
          error={isError ? error?.message : null}
          onRetry={refetch}
          onMarkRead={(item) => markReadMutation.mutate(item.id)}
        />

        <div className="mt-6">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(nextPage) => {
              setPage(nextPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </RecruiterLayout>
  );
}
