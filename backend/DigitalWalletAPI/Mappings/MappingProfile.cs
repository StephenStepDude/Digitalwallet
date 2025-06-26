using AutoMapper;
using DigitalWalletAPI.DTOs;
using DigitalWalletAPI.Models;

namespace DigitalWalletAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.CreatedDate.ToString("yyyy-MM-dd HH:mm:ss")));

            // PaymentMethod mappings
            CreateMap<AddPaymentMethodDto, PaymentMethod>();
            CreateMap<PaymentMethod, PaymentMethodDto>()
                .ForMember(dest => dest.CardNumber, opt => opt.MapFrom(src => $"**** **** **** {src.CardNumber.Substring(src.CardNumber.Length - 4)}"));

            // Transaction mappings
            CreateMap<Transaction, TransactionDto>()
                .ForMember(dest => dest.SenderEmail, opt => opt.MapFrom(src => src.Sender.Email))
                .ForMember(dest => dest.ReceiverEmail, opt => opt.MapFrom(src => src.Receiver.Email));
        }
    }
}
