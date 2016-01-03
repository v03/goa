class LiveController < WebsocketRails::BaseController

	def initialize_session
		controller_store[:map] = {}
		map_id = "map_void"
		controller_store[map_id] = {:map_id => map_id, :world => {}} if controller_store[map_id].nil?
	end

    def client_connected
		WebsocketRails[:stream].trigger(:data, {:event => :client_connected}.to_json)
    end

	def client_disconnected
		WebsocketRails[:stream].trigger(:data, {:event => :client_disconnected}.to_json)
    end

	def new_map
		map_id = "map_" + rand(9999).to_s(36)
		map_id = message[:map_id]
		controller_store[map_id] = {:map_id => map_id, :world => {}} if controller_store[map_id].nil?
		puts "New map: #{map_id}"
		WebsocketRails[:stream].trigger(:map_update, controller_store[map_id].to_json)
	end

	def update_map
		unless message[:layer].nil?
			p message
			map_id = message[:map_id]
			layer = message[:layer].to_i
			p controller_store[map_id]
			controller_store[map_id][:world][layer] = {} if controller_store[map_id][:world][layer].nil?
			controller_store[map_id][:world][layer][message[:id].to_i] = message[:brush].to_i
		end
		WebsocketRails[:stream].trigger(:map_update, controller_store[map_id].to_json)
	end

	def stream

	end
end
