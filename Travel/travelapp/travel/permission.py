from rest_framework import permissions


class CMTOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_permission(request, view) and request.user == comment.user


class BlogOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, blog):
        return super().has_permission(request, view) and request.user == blog.user
