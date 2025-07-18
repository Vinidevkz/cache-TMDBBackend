//criando o nó da lista dupla
type NodeData<T> = {
    key: string
    value: T
}

class DoublyLinkedNode<T> {
    //a chabve e o valor do cache
    data: NodeData<T>
    //aponta para o nó anterior
    prev: DoublyLinkedNode<T> | null = null
    //aponta para o próximo nó
    next: DoublyLinkedNode<T> | null = null

    constructor(data: NodeData<T>) {
        this.data = data
    }
}
//

//classe principal LRUCache:
//capacity = quantos itens o cache pode guardar
//map: para achar qualquer item pelo nome ( O(1) )
//head: nó mais recentemente usado
//tail: nó menos recentemente usado
export class LRUCache<T> {
    private capacity: number
    private map: Map<string, DoublyLinkedNode<T>>
    private head: DoublyLinkedNode<T> | null = null
    private tail: DoublyLinkedNode<T> | null = null

    constructor(capacity: number) {
        this.capacity = capacity
        this.map = new Map()
    }

    //Buscar um item (get)
    //procura o nó no map
    //se não encontrar, retorna null
    //se encontrar move para a frente da lista (se tornando o mais recente) e retorna o valor
    get(key: string): T | null {
        const node = this.map.get(key)
        if (!node) return null
        
        this.moveToFront(node)
        return node.data.value
    }

    //Se  chave já existe, atualiza o valor e move para frente
    //Se for nova, cria um novo nó, adiciona ao map, coloca no começo da lista e
    //se ultrapassou sua capacidade, remove o menos usado(tail)
    put(key: string, value: T): void {
        const existinNode = this.map.get(key)

        if (existinNode){
            existinNode.data.value = value
            this.moveToFront(existinNode)
            return
        }

        const newNode = new DoublyLinkedNode({key, value})
        this.map.set(key, newNode)
        this.addToFront(newNode)

        //se ultrapassou o tamanho pré estabelecido, ele remove o ultimo da lista
        if (this.map.size > this.capacity){
            this.removeLeastUsed()
        }
    }

    //remove o nó da posição atual e coloca no começo da lista(head)
    private moveToFront(node: DoublyLinkedNode<T>): void {
        if (node === this.head) return

        //remove a posição atual
        if (node.prev) node.prev.next = node.next
        if (node.next) node.next.prev = node.prev
        if (node === this.tail) this.tail = node.prev

        node.prev = null
        node.next = this.head
        if (this.head) this.head.prev = node
        this.head = node

        if (!this.tail) this.tail = node
    }

    //Coloca um nó na frente. Se a lista estiver vazia, head e tail apontam para ele
    private addToFront(node: DoublyLinkedNode<T>): void{
        node.next = this.head
        node.prev = null
        if (this.head) this.head.prev = node
        this.head = node

        if (!this.tail) this.tail = node
    }

    //remove o tail tanto da lista quanto do map
    private removeLeastUsed(): void {
        if (!this.tail) return

        this.map.delete(this.tail.data.key)
        if (this.tail.prev) {
            this.tail.prev.next = null
        } else {
            this.head = null
        }
        this.tail = this.tail.prev
    }

    showCache(): string[] {
        const items: string[] = []
        let current = this.head
        while (current) {
            items.push(current.data.key)
            current = current.next
        }
        return items
    }
}

//OBS:
//
//this -> aponta para a instância atual quando é chamada.
//private -> reduz a chamada do método somente dentro da classe onde ele foi instânciado.

