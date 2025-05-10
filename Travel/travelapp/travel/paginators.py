from rest_framework import  pagination
class TourPaginator(pagination.PageNumberPagination):
    page_size = 4

class CommentPaginator(pagination.PageNumberPagination):
    page_size = 3

class BlogPagination(pagination.PageNumberPagination):
    page_size = 4

class ImagePagination(pagination.PageNumberPagination):
    page_size = 2