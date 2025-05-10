import datetime

from django.shortcuts import render
from rest_framework import viewsets, generics, status, parsers, permissions
from travel.models import *
from travel import serializers, permission
import datetime
from rest_framework.decorators import action
from rest_framework.response import Response
from travel import paginators


# Create your views here.


# class AlbumViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
#     queryset = Album.objects
#     serializer_class = serializers.AlbumSerializer

# @action(methods=['delete'], url_path='DeleteAlbum', detail=True)
# def delete(self, request, pk):
#     queryset = Album.objects.get(pk=pk)
#     queryset.delete()
#     return Response(status=status.HTTP_204_NO_CONTENT)


class ImageViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Image.objects.all()
    serializer_class = serializers.ImageSerializer


class ImageViewSetAll(viewsets.ViewSet, generics.ListAPIView):
    queryset = Image.objects
    serializer_class = serializers.ImageSerializer



class LocationViewSet(viewsets.ViewSet, generics.RetrieveAPIView,generics.CreateAPIView ):
    queryset = Location.objects
    serializer_class = serializers.LocationSerializer




class CustomerViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Customer.objects
    serializer_class = serializers.CustomerSerializer


    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('username')
        if q:
            queryset = queryset.filter(username=q, lastname=q)
        return queryset

    @action(methods=['get'], url_path='getCustomerId', detail=True)
    def get_customer(self, request, pk):
        customer = Customer.objects.get(pk=pk)
        return Response(serializers.UserSerializer(customer).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='getCustomerId', detail=True)
    def get_customer(self, request, pk):
        customer = Customer.objects.get(pk=pk)
        return Response(serializers.UserSerializer(customer).data,
                        status=status.HTTP_200_OK)

    @action(methods=['delete'], url_path='delete_customer', detail=True)
    def delete(self, request, pk):
        queryset = Customer.objects.filter(vaitro="VaiTro.Customer")
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)





class TourViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Tour.objects.filter(Active=True)
    serializer_class = serializers.TourSerializer
    pagination_class = paginators.TourPaginator




    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('Price')
        if q:
            queryset = queryset.filter(Adult_price=float(q))

        DeparturePlace = self.request.query_params.get('noidi')
        Destination = self.request.query_params.get('noiden')
        if DeparturePlace:
            queryset = queryset.filter(DeparturePlace__Place_Name__icontains=DeparturePlace)
        if Destination:
            queryset = queryset.filter(Destination__Place_Name__icontains=Destination)
        DepartureTime = self.request.query_params.get('thoigiandi')

        if DepartureTime:
            queryset = queryset.filter(DepartureTime__DepartureDay__icontains=DepartureTime)
        return queryset


class Like_TourViewSet(viewsets.ViewSet, generics.UpdateAPIView):
    queryset = Like_Tour.objects
    serializer_class = serializers.Like_TourSerializer



class PlaceViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Place.objects.all()
    serializer_class = serializers.PlaceSerializer
    permission_classes = [permissions.AllowAny]



class TourViewSetDetail(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Tour.objects.filter(Active=True)
    serializer_class = serializers.TourSerializerDetail
    permission_classes = [permissions.AllowAny]


    def get_permissions(self):
        if self.action in ['add_comment', 'like']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return serializers.AuthenticatedTourDetailsSerializer

        return self.serializer_class



    @action(methods=['post'], url_path='add_comments', detail=True)
    def add_comment(self, request, pk):
        c = CMT_Tour.objects.create(content=request.data.get('content'),image=request.data.get('image'),tour=self.get_object(),
                                                  user=request.user)
        return Response(serializers.CMT_TourSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='like_tour', detail=True)
    def like(self, request, pk):
        li, created = Like_Tour.objects.get_or_create(tour=self.get_object(),
                                                      user=request.user)

        if not created:
            li.Active = not li.Active
            li.save()

        return Response(serializers.TourSerializerDetail(self.get_object()).data, status=status.HTTP_201_CREATED)


    @action(methods=['post'], url_path='create_rating_tour', detail=True)
    def rating_tour(self, request, pk):
        c, created = Rating_Tour.objects.get_or_create(tour=self.get_object(),
                                                  user=request.user)

        if not created:
            c.NumberOfStar = request.data.get('NumberOfStar')
            c.save()
        return Response(serializers.Rating_TourSerializer(c).data, status=status.HTTP_201_CREATED)








class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    @action(methods=['patch'], url_path='changepassword', detail=False)
    def get_change_password(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)


class NewsViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = News.objects.filter(active=True)
    serializer_class = serializers.NewsSerializer
    pagination_class = paginators.BlogPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('content')
        name = self.request.query_params.get('name')
        if q:
            queryset = queryset.filter(content__icontains=q)
        if name:
            queryset = queryset.filter(Name_News__icontains=name)

        return queryset







class NewsDetailViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = News.objects.filter(active=True)
    serializer_class = serializers.NewsDetailSerializer
    pagination_class = paginators.BlogPagination
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['add_comment', 'like']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='add_comments_news', detail=True)
    def add_comment(self, request, pk):
        c = CMT_News.objects.create(content=request.data.get('content'), news=self.get_object(),
                                    user=request.user, image=request.data.get('image'))
        return Response(serializers.CMT_NewsSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='like_news', detail=True)
    def like(self, request, pk):
        li, created = Like_News.objects.get_or_create(news=self.get_object(),
                                                      user=request.user)

        if not created:
            li.Active = not li.Active
            li.save()

        return Response(serializers.NewsDetailSerializer(self.get_object()).data, status=status.HTTP_201_CREATED)




class BookTourViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.UpdateAPIView, generics.RetrieveAPIView):
    queryset = BookTour.objects
    serializer_class = serializers.BookTourSerializer

    def get_queryset(self):
        queryset = self.queryset
        id = self.request.query_params.get('id')
        if id:
            queryset = queryset.filter(id_booktour__icontains=id)
        return queryset

    @action(methods=['delete'], url_path='delete_booktour', detail=True)
    def delete(self, request, pk):
        queryset = BookTour.objects.get(pk=pk)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get'], url_path='getBookTourUId', detail=True)
    def get_booktour_Uid(self, request, pk):
        customerbt = BookTour.objects.get(id_customer_bt_id=pk)
        return Response(serializers.BookTourSerializer(customerbt).data,
                        status=status.HTTP_200_OK)


class BookHotelViewSet(viewsets.ViewSet, generics.ListCreateAPIView,generics.UpdateAPIView):
    queryset = BookHotel.objects
    serializer_class = serializers.BookHotelSerializer


    @action(methods=['delete'], url_path='deleteBookHotel', detail=True)
    def delete(self, request, pk):
        queryset = BookHotel.objects.get(pk=pk)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get'], url_path='getBookTourUId', detail=True)
    def get_bookhotel_uid(self, request, pk):
        customerbh = BookHotel.objects.get(id_user_book_hotel_id=pk)
        return Response(serializers.BookHotelSerializer(customerbh).data,
                        status=status.HTTP_200_OK)


    @action(methods=['get'], url_path='BookHotelId', detail=True)
    def get_queryset(self):
        queryset = self.queryset
        id = self.request.query_params.get('id')
        if id:
            queryset = queryset.filter(id_book_hotel__icontains=id)
        return queryset


class BookTicketViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = BookTicket.objects
    serializer_class = serializers.BookTicketSerializer
    parser_classes = [parsers.MultiPartParser, ]

    @action(methods=['delete'], url_path='delete_booktour', detail=True)
    def delete(self, request, pk):
        queryset = BookTour.objects.get(pk=pk)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get'], url_path='getBookTicketUId', detail=True)
    def get_bookticket_uid(self, request, pk):
        customerbticket = BookHotel.objects.get(id_book_ticket=pk)
        return Response(serializers.BookHotelSerializer(customerbticket).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='get_bookticket', detail=True)
    def get_queryset(self):
        queryset = self.queryset
        id = self.request.query_params.get('id')
        if id:
            queryset = queryset.filter(id__icontains=id)
        return queryset

# class BlogAllViewSet(viewsets.ViewSet, generics.ListAPIView):
#     queryset = Blog.objects.filter(active=True)
#     serializer_class = serializers.BlogSerializer
#     pagination_class = paginators.BlogPagination


class BlogAllViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Blog.objects.filter(active=True)
    serializer_class = serializers.BlogSerializer
    pagination_class = paginators.BlogPagination

    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('content')
        tag = self.request.query_params.get('tag')
        if q:
            queryset = queryset.filter(content__icontains=q)
        if tag:
            queryset = queryset.filter(tag_id=tag)

        return queryset



class BlogViewSet(viewsets.ViewSet, generics.RetrieveAPIView,generics.CreateAPIView):
    queryset = Blog.objects.filter(active=True)
    serializer_class = serializers.BlogSerializer
    pagination_class = paginators.BlogPagination
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['add_comment', 'like']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]



    @action(methods=['post'], url_path='add_comments_blog', detail=True)
    def add_comment(self, request, pk):
        c = CMT_Blog.objects.create(content=request.data.get('content'), blog=self.get_object(),
                                    user=request.user,image=request.data.get('image'))
        return Response(serializers.CMT_BlogSerializer(c).data, status=status.HTTP_201_CREATED)


    @action(methods=['get'], url_path='get_like_blog', detail=True)
    def like_blog(self, request, pk):
        like_blog = Like_Blog.objects
        return Response(serializers.Like_BlogSerializer(like_blog, many=True).data)

    @action(methods=['post'], url_path='like_blog', detail=True)
    def like(self, request, pk):
        li, created = Like_Blog.objects.get_or_create(blog=self.get_object(),
                                                      user=request.user)

        if not created:
            li.Active = not li.Active
            li.save()

        return Response(serializers.BlogSerializer(self.get_object()).data, status=status.HTTP_201_CREATED)


# class DeleteUserViewSet(viewsets.ViewSet, generics.DestroyAPIView):

# class AdminViewSet(viewsets.ViewSet, generics.CreateAPIView):
#     serializer_class = serializers.UserSerializer
#     parser_classes = [parsers.MultiPartParser, ]
#
#     def get_queryset(self):
#         queryset = self.queryset
#         ten = self.request.query_params.get('Name')
#         if ten:
#             queryset = queryset.filter(last_name__icontains=ten)
#         return queryset
#
#     @action(methods=['delete'], url_path='delete_admin', detail=True)
#     def delete(self, request, pk):
#         queryset = Admin.objects.filter(vaitro="VaiTro.Admin")
#         queryset.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
#
#     @action(methods=['get'], url_path='get_admin', detail=True)
#     def get_admin(self, request, pk):
#         admins = Admin.objects.get(pk=pk)
#         return Response(serializers.UserSerializer(admins).data,
#                         status=status.HTTP_200_OK)

class RoomHotelViewSet(viewsets.ViewSet, generics.ListAPIView,generics.RetrieveAPIView):
    queryset = HotelRoom.objects
    serializer_class = serializers.HotelRoomSerializer

    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('type')
        p = self.request.query_params.get('Price')
        if q:
            queryset = queryset.filter(id_room=q)
        if p:
            queryset = queryset.filter(Price=p)
        return queryset


class HotelViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Hotel.objects.all()
    serializer_class = serializers.HotelSerializer
    pagination_class = paginators.BlogPagination

    def get_queryset(self):
        queryset = self.queryset
        p = self.request.query_params.get('address')
        if p:
            queryset = queryset.filter(address__icontains=p)
        return queryset

    @action(methods=['get'], url_path='get_like_hotel', detail=True)
    def like_hotel(self, request, pk):
        like_hotel = Like_Hotel.objects
        return Response(serializers.Like_BlogSerializer(like_hotel, many=True).data)

    @action(methods=['post'], url_path='like_hotel', detail=True)
    def like(self, request, pk):
        li, created = Like_Hotel.objects.get_or_create(hotel=self.get_object(),
                                                       user=request.user)

        if not created:
            li.Active = not li.Active
            li.save()

        return Response(serializers.HotelSerializer(self.get_object()).data, status=status.HTTP_201_CREATED)


class BookTourDetailViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = BookTour.objects
    serializer_class = serializers.BookTourSerializer


class CMT_TourViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = CMT_Tour.objects.all()
    serializer_class = serializers.CMT_TourSerializer
    permission_classes = [permission.CMTOwner]

    @action(methods=['delete'], url_path='delete_cmt_tour', detail=True)
    def delete(self, request, pk):
        queryset = CMT_Tour.objects.get(pk=pk)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CMT_NewsViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = CMT_News.objects.all()
    serializer_class = serializers.CMT_NewsSerializer
    permission_classes = [permission.CMTOwner]

    @action(methods=['delete'], url_path='delete_cmt_news', detail=True)
    def delete(self, request, pk):
        queryset = CMT_News.objects.get(pk=pk)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CMT_BlogViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = CMT_Blog.objects.all()
    serializer_class = serializers.CMT_BlogSerializer
    permission_classes = [permission.CMTOwner]

    @action(methods=['delete'], url_path='delete_cmt_blog', detail=True)
    def delete(self, request, pk):
        queryset = CMT_Blog.objects.get(pk=pk)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Rating_TourViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.DestroyAPIView):
    queryset = Rating_Tour.objects.all()
    serializer_class = serializers.RatingTourSerializer
    permission_classes = [permission.CMTOwner]


class TagViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer


