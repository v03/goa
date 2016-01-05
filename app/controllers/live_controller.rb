class LiveController < WebsocketRails::BaseController

	def initialize_session
		controller_store[:map] = {}
		Map.all.each do |map|
			controller_store[map.name] = {:map_id => map.name, :world => JSON.load(map.world)}
			controller_store[map.name][:num_layers] = get_max_layer(map.name)
			p controller_store[map.name][:world]
		end
		#map_id = "map_void"
		#controller_store[map_id] = {:map_id => map_id, :world => {}} if controller_store[map_id].nil?
	end

    def client_connected
		WebsocketRails[:stream].trigger(:data, {:event => :client_connected}.to_json)
    end

	def client_disconnected
		WebsocketRails[:stream].trigger(:data, {:event => :client_disconnected}.to_json)
    end

	def new_map
		map_id = "map_" + rand(9999).to_s(36)
		map_id = message[:map_id].to_s
		controller_store[map_id] = {:map_id => map_id, :world => {}, :num_layers => 1} if controller_store[map_id].nil?
		puts "New map: #{map_id}"
		WebsocketRails[map_id].trigger(:map_update, controller_store[map_id].to_json)
	end

	def update_map
		unless message[:layer].nil?

			map_id = message[:map_id]
			layer = message[:layer].to_i
			tile_id = message[:id].to_i


			controller_store[map_id][:world][tile_id] = {} if controller_store[map_id][:world][tile_id].nil?
			controller_store[map_id][:world][tile_id][layer] = message[:brush].to_i
			controller_store[map_id][:num_layers] = get_max_layer(map_id)


		end
		WebsocketRails[map_id].trigger(:map_update, controller_store[map_id].to_json)
		save_map(map_id)
	end

	def delete_tile
		unless message[:tile_id].nil?
			map_id = message[:map_id]
			tile_id = message[:tile_id]
			layer = message[:layer]


			controller_store[map_id][:world][tile_id][layer] = nil;

			puts "Deleting layer #{layer} from #{tile_id}"
		end
		puts "Deleting tile #{message[:tile_id]}"
		WebsocketRails[map_id].trigger(:map_update, controller_store[map_id].to_json)
	end

	def stream

	end

	private
	def save_map(map_id)
		if Map.where(:name => map_id).blank?
			puts "No such map exists - insert"
			Map.create(:name => map_id, :world => controller_store[map_id][:world].to_json)
		else
			puts "Updating map"
			Map.find_by(:name => map_id).update(:world => controller_store[map_id][:world].to_json)

		end
	end

	def get_max_layer(map_id)
		max_layer = [1]
		p [map_id, max_layer]
		max_layer = controller_store[map_id][:world].map do |tile|
			tile[1].keys.map{|k| k.to_i}.max
		end
		return max_layer.max
	end

	def get_max_layer_tile(map_id, tile_id)
		p controller_store[map_id][:world][tile_id]
		return controller_store[map_id][:world][tile_id].keys.map{|k| k.to_i}.max
	end


end
