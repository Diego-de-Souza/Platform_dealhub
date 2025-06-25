package com.fesa.dealhub.service;

import com.fesa.dealhub.dto.CarrinhoDTO;
import com.fesa.dealhub.dto.ItemCarrinhoDTO;
import com.fesa.dealhub.exception.AuthorizationException;
import com.fesa.dealhub.exception.BusinessException;
import com.fesa.dealhub.exception.ResourceNotFoundException;
import com.fesa.dealhub.model.Carrinho;
import com.fesa.dealhub.model.ItemCarrinho;
import com.fesa.dealhub.model.Produto;
import com.fesa.dealhub.model.Usuario;
import com.fesa.dealhub.repository.CarrinhoRepository;
import com.fesa.dealhub.repository.ItemCarrinhoRepository;
import com.fesa.dealhub.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CarrinhoService {

    private final CarrinhoRepository carrinhoRepository;
    private final ItemCarrinhoRepository itemCarrinhoRepository;
    private final ProdutoRepository produtoRepository;

    public CarrinhoDTO adicionarItem(Long usuarioId, ItemCarrinhoDTO itemDTO) {
        Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

        validarEstoque(produto, itemDTO.getQuantidade());

        Carrinho carrinho = obterOuCriarCarrinho(usuarioId);

        ItemCarrinho item = ItemCarrinho.builder()
                .produto(produto)
                .quantidade(itemDTO.getQuantidade())
                .preco(produto.getPreco().doubleValue())
                .build();

        carrinho.adicionarItem(item);
        carrinhoRepository.save(carrinho);

        return converterParaDTO(carrinho);
    }

    public CarrinhoDTO atualizarQuantidadeItem(Long usuarioId, Long itemId, int novaQuantidade) {
        ItemCarrinho item = itemCarrinhoRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado"));

        if (!item.getCarrinho().getUsuario().getId().equals(usuarioId)) {
            throw new AuthorizationException("Item não pertence ao usuário");
        }

        validarEstoque(item.getProduto(), novaQuantidade);

        item.setQuantidade(novaQuantidade);
        itemCarrinhoRepository.save(item);

        Carrinho carrinho = carrinhoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

        return converterParaDTO(carrinho);
    }

    public CarrinhoDTO removerItem(Long usuarioId, Long itemId) {
        ItemCarrinho item = itemCarrinhoRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado"));

        if (!item.getCarrinho().getUsuario().getId().equals(usuarioId)) {
            throw new AuthorizationException("Item não pertence ao usuário");
        }

        Carrinho carrinho = item.getCarrinho();
        carrinho.getItens().remove(item);
        itemCarrinhoRepository.delete(item);
        carrinhoRepository.save(carrinho);

        return converterParaDTO(carrinho);
    }

    public CarrinhoDTO obterCarrinhoPorUsuario(Long usuarioId) {
        Carrinho carrinho = carrinhoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> criarCarrinhoVazio(usuarioId));

        return converterParaDTO(carrinho);
    }

    public void limparCarrinho(Long usuarioId) {
        Carrinho carrinho = carrinhoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

        itemCarrinhoRepository.deleteAllByCarrinhoId(carrinho.getId());
        carrinho.getItens().clear();
        carrinhoRepository.save(carrinho);
    }

    private Carrinho obterOuCriarCarrinho(Long usuarioId) {
        return carrinhoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> criarCarrinhoVazio(usuarioId));
    }

    private Carrinho criarCarrinhoVazio(Long usuarioId) {
        Carrinho carrinho = Carrinho.builder()
                .usuario(Usuario.builder().id(usuarioId).build())
                .build();
        return carrinhoRepository.save(carrinho);
    }

    private void validarEstoque(Produto produto, int quantidade) {
        if (quantidade <= 0) {
            throw new BusinessException("Quantidade deve ser maior que zero");
        }
        if (produto.getEstoque() < quantidade) {
            throw new BusinessException(
                    String.format("Estoque insuficiente para o produto %s. Estoque disponível: %d",
                            produto.getNome(), produto.getEstoque()));
        }
    }

    private CarrinhoDTO converterParaDTO(Carrinho carrinho) {
        List<ItemCarrinhoDTO> itensDTO = carrinho.getItens().stream()
                .map(this::converterItemParaDTO)
                .toList();

        CarrinhoDTO carrinhoDTO = new CarrinhoDTO();
        carrinhoDTO.setId(carrinho.getId());
        carrinhoDTO.setUsuarioId(carrinho.getUsuario().getId());
        carrinhoDTO.setItens(itensDTO);
        carrinhoDTO.setTotal(carrinho.getTotal());
        carrinhoDTO.setDataAtualizacao(carrinho.getDataAtualizacao());
        carrinhoDTO.setTotalItens(carrinho.getItens().size());
        return carrinhoDTO;
    }

    private ItemCarrinhoDTO converterItemParaDTO(ItemCarrinho item) {
        ItemCarrinhoDTO dto = new ItemCarrinhoDTO();
        dto.setId(item.getId());
        dto.setProdutoId(item.getProduto().getId());
        dto.setNomeProduto(item.getProduto().getNome());
        dto.setQuantidade(item.getQuantidade());
        dto.setPreco(item.getPreco());
        dto.setSubtotal(item.getSubtotal());
        dto.setDataAdicao(item.getDataAdicao());
        dto.setEstoqueDisponivel(item.getProduto().getEstoque());
        return dto;
    }
}
